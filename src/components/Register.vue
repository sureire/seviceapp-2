<template>
  <q-form 
    @submit.prevent="onSubmit"
    @reset="onReset"
    class="q-pa-md"
    >
        <!-- <q-field rounded filled  stack-label>
            <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">Register a Provider</div>
            </template>
        </q-field> -->
        <q-chip square size="18px" color="teal-2" icon="login">
            {{usertype}} Registration
        </q-chip>
        <q-input
            outlined
            v-model="provider.name"
            ref = "name"
            label="Your Name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type your name']"
        />
        <q-input
            outlined
            ref = "email"
            v-model="provider.email"
            label="Email"
            lazy-rules
            :rules="[ val => val && val.length > 0 && validEmail(this.provider.email)|| 'Please type your email']"
        />
        <q-input
            outlined
            ref = "mobile"
            v-model="provider.mobile"
            label="Mobile No."
            lazy-rules
            :rules="[ val => val && val.length > 0  && validMobile(this.provider.mobile)|| 'Please enter a valid Mobile no.']"
        />
        <div>
            <q-input
            outlined
            v-model="provider.address"
            label="Address"
            autogrow
            />
        </div>        
        <q-checkbox class="q-pt-md" v-model="chktc">
            <div class="text-weight-medium">  
            I read and accept the <a href="" @click="showtc=true" >terms and conditions</a> of VplusU.in
            </div>
        </q-checkbox>
        <div class="row">
            <q-space/>
            <q-btn :disable="!chktc" color="primary" type="submit" label="Register" />
        </div>
        <q-dialog v-model="enableotp" persistent transition-show="scale" transition-hide="scale">
            <otpform :text="otp" @success="onOtpSuccess" @Resend="onResend"/>
        </q-dialog>
        <q-dialog v-model="showtc" persistent transition-show="rotate" transition-hide="rotate">
             <tc-form />
        </q-dialog>        
    </q-form>

</template>

<script>
export default {
    components :{
        'otpform' : require('components/otpform.vue').default,
        'tc-form' : require('components/TermsCd.vue').default        
    },    
    props: ['usertype'],
    data() {
        return {
            enableotp:false,
            otp:null,
            showtc:false,
            chktc:false,            
            provider: {
                name:'',
                email:'',
                mobile:'',
                usertype:'',
                address:''
            }

        }
    },
    methods : {
                async onSubmit(){
                    if (this.$refs.name.hasError || this.$refs.email.hasError || this.$refs.mobile.hasError) {
                        this.showNotifyError('Missing data, please complete all the fields')
                        return
                    }
                    if (this.$store.state.testMode)
                        this.otp = 1234
                    else
                        this.otp = await this.sendOTP(' ' + this.provider.name,this.provider.mobile)
                    this.enableotp = true
                },
                onOtpSuccess() {
                    this.enableotp = false
                    this.onRegister()
                },
                onRegister(){
                    if (this.usertype === 'Engineer'){
                        //console.log(`${process.env.HOSTNAME}/providers/${this.provider.mobile}`)
                        this.$http.get(`${process.env.HOSTNAME}/providers/${this.provider.mobile}`)
                        .then(response => {
                            //console.log(response.data)
                            if (response.data){
                                // this.$q.dialog({
                                // title: 'Alert',
                                // message: 'Mobile already registered! Check with the Admin'
                                // })
                                this.showNotifyError('Mobile already registered! Check with the Admin')
                            }
                        })
                        .catch(err => {
                                this.$http.post(`${process.env.HOSTNAME}/provider`, this.provider)
                                .then(Response => {
                                    this.showNotify()
                                    this.$q.dialog({
                                        title: 'Alert',
                                        message: 'Account Registered !!. Check with VplusU Admin to activate the account'
                                        })
                                     this.$store.commit('setSelectedProvider',Response.data)
                                     this.$router.push('/providerservices')
                                     this.$store.commit('setLoginStatus',true)
                                    })
                                    .catch(err => {
                                        this.showNotifyError('Mobile already registered! Check with the Admin')
                                    })
                        })
                    }
                    else {
                        //console.log(`${process.env.HOSTNAME}/users/${this.provider.mobile}`)
                        this.$http.get(`${process.env.HOSTNAME}/users/${this.provider.mobile}`)
                        .then(response => {
                            //console.log(response.data)
                            if (response.data){
                                // this.$q.dialog({
                                // title: 'Alert',
                                // message: 'Mobile already registered! Check with the Admin'
                                // })
                                this.showNotifyError('Mobile already registered! Check with the Admin')
                            }
                            else {
                            }
                        })
                        .catch(err => {
                                this.usertype === 'User' ? this.provider.usertype = 1 : this.provider.usertype = 2
                                this.$http.post(`${process.env.HOSTNAME}/user`, this.provider)
                                .then(Response => {
                                    this.showNotify()
                                    this.$store.commit('setSelectedUser',Response.data)
                                    this.$router.push('/')
                                    this.$store.commit('setLoginStatus',true)
                                })
                                .catch(err => {
                                    this.showNotifyError('Error in registering ' + this.usertype)
                                    throw(err)
                                })
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
                            position: 'top',
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
                onResend() {
                    this.sendOTP(' User',this.provider.mobile)
                                                .then( res => {
                                                        this.otp = res
                                                        //console.log('OTP is ' + res)
                                                        this.enableotp = true                        
                                                })
                },
    }

}
</script>

<style>

</style>