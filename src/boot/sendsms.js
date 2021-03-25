import axios from 'axios'
import Vue from 'vue'

Vue.mixin({
    methods: {
      testfunc: function(str){
            return 'this is from mixin ' + str + process.env.USERTYPE
      },
      async testapi(mobile){
        try {
            let res = await axios.get(`${process.env.HOSTNAME}/users/${mobile}`)
            //console.log(res.data)
        }catch(err){
            console.error(err)
            throw err
        }
        return mobile
      },
      async sendOTP(name, mobile) {
        this.$q.loading.show()
        let otp = Math.floor(Math.random() * 1000000) + 1
        let payload = {
            From: 'GREENU',
            To: mobile.toString(),
            TemplateName: 'GPSOTP2',
            VAR1:name.slice(0,30),
            VAR2:otp.toString()
        }
        try {
            //console.log(payload)
            let res = await axios.post(`${process.env.TWOFACTORURL}`,payload)
            //console.log(res.data)
            this.$q.loading.hide()
            return otp
        }catch(err){
            this.$q.loading.hide()
            console.error(err)
            throw err
        }
      },
      async sendWelcomeMsg(name, serviceid, mobile) {
        this.$q.loading.show()
        let payload = {
            From: 'GREENU',
            To: mobile.toString(),
            TemplateName: 'GPSWelcome1',
            VAR1:name.slice(0,30),
            VAR2:serviceid.toString(),
            VAR3:mobile.toString()
        }
        try {
            let res = await axios.post(`${process.env.TWOFACTORURL}`,payload)
            //console.log(res.data)
        }catch(err){
            console.error(err)
            throw err
        }
        this.$q.loading.hide()
      },
      async sendEngtoCustomerMsg(name, engineer, usermobile, engmobile) {
        this.$q.loading.show()
        let a = this.$store.state.Settings.filter(a => a.key1 === 'minimum_charge')
        let payload = {
            From: 'GREENU',
            To: usermobile.toString(),
            TemplateName: 'GPSEngtoCust2',
            VAR1:name.slice(0,30),
            VAR2:engineer.slice(0,30),
            VAR3:engmobile.toString(),
            VAR4: a[0].value.toString()
        }
        try {
            let res = await axios.post(`${process.env.TWOFACTORURL}`,payload)
            //console.log(res.data)
        }catch(err){
            console.error(err)
            throw err
        }
        this.$q.loading.hide()
      },
      async sendClosureMsg(name,mobile) {
        this.$q.loading.show()
        let otp = Math.floor(Math.random() * 1000000) + 1          
        let payload = {
            From: 'GREENU',
            To: mobile.toString(),
            TemplateName: 'GPSClosure',
            VAR1:name.slice(0,30),
            VAR2:otp.toString()
        }
        try {
            let res = await axios.post(`${process.env.TWOFACTORURL}`,payload)
            //console.log(res.data)
        }catch(err){
            console.error(err)
            throw err
        }
        this.$q.loading.hide()
        return otp
      },
      async sendCancelMsg(name,mobile,serviceid,reason) {
        this.$q.loading.show()
        let payload = {
            From: 'GREENU',
            To: mobile.toString(),
            TemplateName: 'GPSCancelling',
            VAR1:name.slice(0,30),
            VAR2:serviceid.toString(),
            VAR3:reason.slice(0,30)
        }
        try {
            let res = await axios.post(`${process.env.TWOFACTORURL}`,payload)
            //console.log(res.data)
        }catch(err){
            console.error(err)
            throw err
        }
        this.$q.loading.hide()
      }             

    }
  })