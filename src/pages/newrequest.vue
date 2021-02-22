<template>
  <q-page padding class="constrain-more">
    <q-chip size="18px" icon="bookmark">
        New Service Request for {{$store.state.selectedservice}}
    </q-chip>
    <div  class="q-pa-md">
        <div v-if= "!userid || $store.state.usertype === 'Dealer'">
            <q-input  v-model="username" label="Name" />
            <q-input  v-model="mobile" label="Mobile" 
                lazy-rules :rules="[ val => val && val.length > 0 || 'Please enter a valid Mobile no.']"
                    />
        </div>

        <q-input  v-model="newRequest.requestdate" label="Requested Date" mask="date" :rules="['date']">
        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="newRequest.requestdate">
                <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
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
             <otpform text='Enter OTP for login' @success="onOtpSuccess"/>
        </q-dialog>
        <q-dialog v-model="showtc" persistent transition-show="rotate" transition-hide="rotate">
             <tc-form />
        </q-dialog>
    </div>

  </q-page>
</template>

<script>
export default {
    components :{
        'otpform' : require('components/otpform.vue').default,
        'tc-form' : require('components/TermsCd.vue').default
    },    
    data() {
        return {
            enableotp: false,
            showtc:false,
            chktc:false,
            userid: this.$store.state.selectedUser.id,
            username: null,
            mobile: null,
            newRequest :{
                userid: this.$store.state.selectedUser.id,
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
        },
        onCreate(){
            if (!this.userid) {
                this.enableotp = true;
                return
            }
            if (this.$store.state.usertype === 'Dealer'){
                this.newRequest.createdby = this.userid
                this.CreateNewUserandAddRequest()
            }
            else
                this.CreateRequest()
        },
        CreateRequest(){
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
                        return
                    })
                }
                else {
                    //add a service request
                    this.$http.post(process.env.HOSTNAME + '/srequest', this.newRequest)
                    .then(Response => {
                        //this.$store.commit('setSelectedProvider',Response.data)
                        this.$router.push('/userrequests')
                        this.$store.commit('setSelectedTab','Services')
                        this.showNotify()
                    })
                    .catch(err => {
                        throw(err)
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
        },
        CreateNewUserandAddRequest(){
            let newuser = {
                name: this.username,
                email:'',
                mobile:this.mobile,
                usertype:1
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
        }
    },
    mounted() {
        console.log('userid is ' + this.userid)
    }

}
</script>

<style>

</style>