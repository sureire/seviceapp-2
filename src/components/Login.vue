
<template>
    <div class="screencenter">
        <div v-if="register" >
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
                <q-chip square size="18px" color="deep-orange-3" text-color="black" icon="login">
                    {{usertype}} Login
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
                <q-btn color="primary" type="submit" label="Register" />
                <q-dialog v-model="enableotp" persistent transition-show="scale" transition-hide="scale">
                    <otpform text='Enter OTP for login' @success="onOtpSuccess"/>
                </q-dialog>
            </q-form>

        </div>
        <div v-else class="q-pa-md" style="max-width: 400px">
            <q-card class="q-pa-md">
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
                <div >
                    <q-btn rounded icon="login" color="primary" label="Login" @click="onLogon"/>
                </div>
            <q-separator spaced="md"/>
            <q-dialog v-model="enableotp" persistent transition-show="scale" transition-hide="scale">
                <otpform text='Enter OTP for login' @success="onOtpSuccess"/>
            </q-dialog>
            <q-banner rounded class="bg-white text-black">
                <span class="q-pa-md">New Provider click </span>
                <!-- <template v-slot:action> -->
                    <q-btn rounded icon="person_add" color="primary" label="Register" @click="register=true"/>
                <!-- </template> -->
            </q-banner>
            </q-card>
        </div>
        <q-dialog v-model="alert">
                <q-card>
                    <q-card-section>
                    <div class="text-h6">Alert</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        Mobile not registered!! Please Register
                    </q-card-section>

                    <q-card-actions align="right">
                    <q-btn flat label="OK" color="primary" v-close-popup />
                    </q-card-actions>
                </q-card>
        </q-dialog>
    </div>
</template>


<script>
export default {
    components :{
        'otpform' : require('components/otpform.vue').default
    },

data() {
    return {
        alert: false,
        register: false,
        duplicate: false,
        enableotp:false,
        usertype: '',
        provider: {
            name:'',
            email:'',
            mobile:''
        }
    }
},
mounted() {
    this.usertype = this.$store.state.usertype
},
computed: {

},
methods: {
        onSubmit(){
            if (this.$refs.name.hasError || this.$refs.email.hasError || this.$refs.mobile.hasError) {
                this.alert=true
                return
            }
            this.enableotp = true
        },
        onRegister(){
            if (this.usertype === 'Provider'){
                console.log(`${process.env.HOSTNAME}/providers/${this.provider.mobile}`)
                this.$http.get(`${process.env.HOSTNAME}/providers/${this.provider.mobile}`)
                .then(response => {
                    console.log(response.data)
                    if (response.data){
                        this.$q.dialog({
                        title: 'Alert',
                        message: 'Mobile already registered! Check with the Admin'
                        })
                    }
                })
                .catch(err => {
                        this.$http.post(`${process.env.HOSTNAME}/provider`, this.provider)
                        .then(Response => {
                            this.$q.dialog({
                                title: 'Alert',
                                message: 'Account Registered !!. Check with VplusU Admin to activate the account'
                                })
                            // this.$store.commit('setSelectedProvider',Response.data)
                            // this.$router.push('/')
                        })
                        .catch(err => {
                            throw(err)
                        })
                })
            }
            else {
                console.log(`${process.env.HOSTNAME}/users/${this.provider.mobile}`)
                this.$http.get(`${process.env.HOSTNAME}/users/${this.provider.mobile}`)
                .then(response => {
                    console.log(response.data)
                    if (response.data){
                        this.$q.dialog({
                        title: 'Alert',
                        message: 'Mobile already registered! Check with the Admin'
                        })
                    }
                    else {
                        this.$http.post(`${process.env.HOSTNAME}/user`, this.provider)
                        .then(Response => {
                            this.$store.commit('setSelectedUser',Response.data)
                            this.$router.push('/')
                        })
                        .catch(err => {
                            throw(err)
                        })
                    }
                })
            }
        },
        onReset() {

        },
        onLogon(){
            if (!this.provider.mobile)
                return
            this.enableotp = true
            console.log('enableotp is ' + this.enableotp)
        },
        onOtpSuccess() {
            this.enableotp = false
            if (this.register)
                this.onRegister()
            else {
                if (this.usertype == 'User'){
                    this.$http.get(`${process.env.HOSTNAME}/users/${this.provider.mobile}`)
                    .then(response => {
                        this.$store.commit('setSelectedUser',response.data)
                        if (this.$store.state.selectedservice)
                            this.$router.push('/newrequest')    
                        else{
                            this.$store.commit('setSelectedTab','Services')
                            this.$router.push('/userrequests')            
                        }
                    })
                    .catch(err => {
                        this.alert = true
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
                        this.alert = true
                    })
                }
            }
        },
        validEmail(email) {
        let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
        },
        validMobile(mobile) {
            return (/^\d{10}$/).test(mobile);
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