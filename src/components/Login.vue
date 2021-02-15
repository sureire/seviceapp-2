
<template>
    <form class="q-pa-md" @submit.prevent="onSubmit">
            <q-chip square size="18px" color="blue-grey-2" text-color="black" icon="login">
                {{usertype}} Login
            </q-chip>
            <div class="q-pa-sm"/>
            <q-input
                    outlined
                    ref = "mobile"
                    v-model="provider.mobile"
                    label="Mobile No."
                    lazy-rules
                    :rules="[ val => val && val.length > 0  && validMobile(this.provider.mobile)|| 'Please enter a valid Mobile no.']"
                />
                <div class="row" >
                    <q-space/>
                    <q-btn rounded icon="login" color="primary" label="Login" type="submit"/>
                </div>
            <q-dialog v-model="enableotp" persistent transition-show="scale" transition-hide="scale">
                <otpform text='Enter OTP for login' @success="onOtpSuccess"/>
            </q-dialog>

    </form>
</template>


<script>
export default {
    components :{
        'otpform' : require('components/otpform.vue').default
    },
    props: ['usertype' ],

data() {
    return {
        alert: false,
        duplicate: false,
        enableotp:false,
        provider: {
            name:'',
            email:'',
            mobile:''
        }
    }
},

computed: {

},
methods: {
        onSubmit(){
            if (this.$refs.mobile.hasError) {
                this.showNotifyError()
                return
            }
            if (!this.provider.mobile){
                this.showNotifyError('Mobile number empty')
                return
            }
            this.enableotp = true
        },
        // onRegister(){
        //     if (this.usertype === 'Engineer'){
        //         console.log(`${process.env.HOSTNAME}/providers/${this.provider.mobile}`)
        //         this.$http.get(`${process.env.HOSTNAME}/providers/${this.provider.mobile}`)
        //         .then(response => {
        //             console.log(response.data)
        //             if (response.data){
        //                 this.$q.dialog({
        //                 title: 'Alert',
        //                 message: 'Mobile already registered! Check with the Admin'
        //                 })
        //             }
        //         })
        //         .catch(err => {
        //                 this.$http.post(`${process.env.HOSTNAME}/provider`, this.provider)
        //                 .then(Response => {
        //                     this.showNotify()
        //                     this.$q.dialog({
        //                         title: 'Alert',
        //                         message: 'Account Registered !!. Check with VplusU Admin to activate the account'
        //                         })
        //                     // this.$store.commit('setSelectedProvider',Response.data)
        //                     // this.$router.push('/')
        //                 })
        //                 .catch(err => {
        //                     throw(err)
        //                 })
        //         })
        //     }
        //     else {
        //         console.log(`${process.env.HOSTNAME}/users/${this.provider.mobile}`)
        //         this.$http.get(`${process.env.HOSTNAME}/users/${this.provider.mobile}`)
        //         .then(response => {
        //             console.log(response.data)
        //             if (response.data){
        //                 this.$q.dialog({
        //                 title: 'Alert',
        //                 message: 'Mobile already registered! Check with the Admin'
        //                 })
        //             }
        //             else {
        //             }
        //         })
        //         .catch(err => {
        //                 this.$http.post(`${process.env.HOSTNAME}/user`, this.provider)
        //                 .then(Response => {
        //                     this.showNotify()
        //                     this.$store.commit('setSelectedUser',Response.data)
        //                     this.$router.push('/')
        //                 })
        //                 .catch(err => {
        //                     throw(err)
        //                 })
        //         })
        //     }
        // },
        onReset() {

        },

        onOtpSuccess() {
            this.enableotp = false
                if (this.usertype == 'User' || this.usertype == 'Dealer'){
                    this.$http.get(`${process.env.HOSTNAME}/users/${this.provider.mobile}`)
                    .then(response => {
                        this.$q.notify('User ' + response.data.name + ' logged in!!')
                        this.$store.commit('setSelectedUser',response.data)
                        if (this.$store.state.selectedservice)
                            this.$router.push('/newrequest')    
                        else{
                            this.$store.commit('setSelectedTab','Services')
                            this.$router.push('/userrequests')            
                        }
                    })
                    .catch(err => {
                        this.showNotifyError('User Mobile not registered !! Click Register')
                        //throw(err)
                    })
                }
                else {
                    this.$http.get(`${process.env.HOSTNAME}/providers/${this.provider.mobile}`)
                    .then(response => {
                        this.$store.commit('setSelectedProvider',response.data)
                        this.$router.push('/providerservices')            
                    })
                    .catch(err => {
                        //throw(err)
                        this.showNotifyError('Engineer Mobile not registered !! Click Register')
                    })
                }
        },
        validEmail(email) {
        let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
        },
        validMobile(mobile) {
            return (/^\d{10}$/).test(mobile);
        },
        showNotify(){
                this.$q.notify({
                    progress: true,
                    caption: 'Registration',
                    message: this.provider.name + ' successfully registered in VplusU',
                    icon: 'announcement',
                    timeout: 5000
                })
        },
        showNotifyError(msg){
                this.$q.notify({
                    position: 'top',
                    color: 'negative',
                    message: msg,
                    icon: 'report_problem',
                    timeout: 5000
                })            
        },
        DuplicateCheck(){
            console.log(this.register)



        }

    }
}
</script>

<style>
.container {
  position: fixed;
  top:25%;
  left:50%;
  transform: translate(-50%,-50%);
  width: 300px;
}
.screencenter {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>