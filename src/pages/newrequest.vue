<template>
  <q-page padding class="constrain-more">
    <q-chip size="18px" icon="bookmark" color="teal-2">
        New Service Request for {{$store.state.selectedservice}}
    </q-chip>
    <div  class="q-pa-md">
        <div v-if= "!userid || $store.state.usertype === 'Dealer'">
            <q-input  v-model="username" label="Name" />
            <q-input  v-model="mobile" label="Mobile" 
                lazy-rules :rules="[ val => val && val.length > 0 || 'Please enter a valid Mobile no.']"
                    />
            <div >
                <q-input
                v-model="address"
                label="Address"
                autogrow
                />
            </div>                    
        </div>
        <q-input  v-model="newRequest.requestdate" label="Requested Date" mask="##-##-####" @click="$refs.qDateProxy.show()" clearable>
        <template v-slot:append>
            <q-icon name="event" color="primary" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="newRequest.requestdate" :options="optionsFn"  mask="DD-MM-YYYY" @input="$refs.qDateProxy.hide()">
                </q-date>
            </q-popup-proxy>
            </q-icon>
        </template>
        </q-input>
        <q-input v-model="newRequest.description" label="Service Description" />
        <q-select class="q-pt-md" v-model="newRequest.preferedtimeslot" :options="timeslot" label="Pick a TimeSlot" />
        <q-toggle class="q-pt-md" v-model="newRequest.emergency" color="red" label="Emergency" />
        <q-checkbox class="q-pt-md" v-model="chktc">
            <div class="text-weight-medium">  
            I read and accept the <a href="" @click="showtc=true" >terms and conditions</a> of VplusU.in
            </div>
        </q-checkbox>
        <div class="q-pt-xs">
            <q-btn icon="add_alert" label="Create" :disable="!chktc" color="primary" @click="onCreate"/>
        </div>
        <q-dialog v-model="enableotp" persistent transition-show="scale" transition-hide="scale">
             <otpform :text="otp" @success="onOtpSuccess"/>
        </q-dialog>
        <q-dialog v-model="showtc" persistent transition-show="rotate" transition-hide="rotate">
             <tc-form />
        </q-dialog>
    </div>

  </q-page>
</template>

<script>
import { date } from 'quasar'
export default {
    components :{
        'otpform' : require('components/otpform.vue').default,
        'tc-form' : require('components/TermsCd.vue').default
    },    
    data() {
        return {
            otp:null,
            enableotp: false,
            showtc:false,
            chktc:false,
            userid: this.$store.state.selectedUser? this.$store.state.selectedUser.id:'',
            username: null,
            mobile: null,
            address: null,            
            newRequest :{
                userid: this.$store.state.selectedUser? this.$store.state.selectedUser.id:'',
                category: this.$store.state.selectedservice,
                location: this.$store.state.selectedlocation,
                requestdate: '',
                status: 'pending',
                preferedtimeslot: '',
                emergency: false,
                description: '',
                createdby: null
            },
            timeslot :['Morning', 'Afternoon', 'Evening' ] 
        }
    },

    methods: {
        onOtpSuccess(){
            this.enableotp= false
            if (!this.userid) {
                this.$http.get(`${process.env.HOSTNAME}/users/${this.mobile}`)
                .then(response => {
                    console.log(response.data)
                    if (response.data){
                        this.CreateRequest()
                    }
                })
                .catch(err => {
                        this.CreateNewUserandAddRequest()
                })

            }
            this.$q.loading.hide()
        },
        async onCreate(){
            if (!this.userid) {
                this.otp = await this.sendOTP(' User',this.mobile)
                this.enableotp = true;
                return
            }
            if (this.$store.state.usertype === 'Dealer'){
                this.newRequest.createdby = this.userid
                this.CreateNewUserandAddRequest()
            }
            else
                this.CreateRequest()
            this.$q.loading.hide()
        },
        CreateRequest(){
            this.$q.loading.show()
            //duplicate check for service request
            console.log(`${process.env.HOSTNAME}/srequestdupcheck/${this.newRequest.userid}/${this.newRequest.location}/${this.newRequest.category}`)
            this.$http.get(`${process.env.HOSTNAME}/srequestdupcheck/${this.newRequest.userid}/${this.newRequest.location}/${this.newRequest.category}`)
            .then(response => {
                console.log('response is ' + JSON.stringify(response.data))
                if (response.data.cnt > 0){
                    this.$q.dialog({
                        title: 'Alert',
                        message: 'Service Request already added, please contact VplusU'
                    }).onDismiss(()=>{
                        this.$q.loading.hide()
                        return
                    })
                }
                else {
                    //add a service request
                    console.log('Date is ' + this.newRequest.requestdate)
                    let d = date.extractDate(this.newRequest.requestdate,'DD-MM-YYYY')
                    console.log(d)
                    this.newRequest.requestdate = date.formatDate(d, 'YYYY-MM-DD')
                    console.log('Date is ' + this.newRequest.requestdate)
                    this.$http.post(process.env.HOSTNAME + '/srequest', this.newRequest)
                    .then(Response => {
                        //this.$store.commit('setSelectedProvider',Response.data)
                        this.$router.push('/userrequests')
                        this.$store.commit('setSelectedTab','Services')
                        this.showNotify()
                        this.$q.loading.hide()
                        if (!this.$store.state.testMode)
                            this.sendWelcomeMsg(this.username?this.username:this.$store.state.selectedUser.name, Response.data.id,this.mobile?this.mobile:this.$store.state.selectedUser.mobile)
                    })
                    .catch(err => {
                        this.$q.loading.hide()
                        throw(err)
                    })
                }
            })
            .catch(err => {
                this.$q.loading.hide()
                console.error(err)
            })
        },
        CreateNewUserandAddRequest(){
            this.$q.loading.show()
            let newuser = {
                name: this.username,
                email:'',
                mobile:this.mobile,
                usertype:1,
                address: this.address
            }
            //first check if the customer aleady exists
            this.$http.get(`${process.env.HOSTNAME}/users/${this.mobile}`)
                .then(response => {  
                    this.newRequest.userid = response.data.id
                    this.CreateRequest()
                 })
                 .catch(err => {
                    this.$http.post(`${process.env.HOSTNAME}/user`, newuser)
                    .then(Response => {
                        if (this.$store.state.usertype !== 'Dealer')
                            this.$store.commit('setSelectedUser',Response.data)
                        this.newRequest.userid = Response.data.id
                        this.$store.commit('setLoginStatus',true)
                        this.CreateRequest()
                    })
                 })
        },
        showNotify(){
                this.$q.notify({
                    caption: 'Service Created',
                    message: 'A new Service Request was created. A Professional would soon contact you..',
                    icon: 'announcement',
                    timeout: 5000
                })
        },
        optionsFn (d) {
            var rightNow = new Date();
            var res = date.formatDate(rightNow,'YYYY/MM/DD')
            return d >= res
            },            
        
    },
    mounted() {
        console.log('userid is ' + this.userid)
    }

}
</script>

<style>

</style>