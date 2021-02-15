<template>
  <q-page padding class="q-gutter-md">
    <q-chip size="18px" icon="bookmark">
        New Service Request for {{$store.state.selectedservice}}
    </q-chip>
    <div  class="q-pa-md" style="max-width: 350px">
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
        <q-select class="q-pa-xs" v-model="newRequest.preferedtimeslot" :options="timeslot" label="Pick a TimeSlot" />
        <q-toggle class="q-pa-md" v-model="newRequest.emergency" color="red" label="Emergency" />
        <div class="q-pa-xs">
            <q-btn icon="add_alert" label="Create" color="primary" @click="onCreate"/>
        </div>
        <q-dialog v-model="enableotp" persistent transition-show="scale" transition-hide="scale">
             <otpform text='Enter OTP for login' @success="onOtpSuccess"/>
        </q-dialog>
    </div>

  </q-page>
</template>

<script>
export default {
    components :{
        'otpform' : require('components/otpform.vue').default
    },    
    data() {
        return {
            enableotp: false,
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
            this.$http.post(process.env.HOSTNAME + '/srequest', this.newRequest)
            .then(Response => {
                //this.$store.commit('setSelectedProvider',Response.data)
                this.$router.push('/userrequests')
                this.showNotify()
            })
            .catch(err => {
                throw(err)
            })
        },
        CreateNewUserandAddRequest(){
            let newuser = {
                name: this.username,
                email:'',
                mobile:this.mobile,
                usertype:1
            }
            this.$http.post(`${process.env.HOSTNAME}/user`, newuser)
                .then(Response => {
                    if (this.$store.state.usertype !== 'Dealer')
                        this.$store.commit('setSelectedUser',Response.data)
                    this.newRequest.userid = Response.data.id
                    this.CreateRequest()

                })
                .catch(err => {
                    throw(err)
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