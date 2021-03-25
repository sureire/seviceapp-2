<template>
   <div class="q-pa-sm"> 
    <q-card class="my-card" bordered>
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <!-- <q-item-label v-if="service.serviceprovider">{{service.mobile}}</q-item-label>
              <q-item-label v-else>xxxxxxxxxxxx</q-item-label> -->
              <q-item-label>{{showMobile}}</q-item-label>
              <q-item-label overline>
                {{service.name}}
              </q-item-label>

            </q-item-section>
            <!-- <q-card-section>
            </q-card-section> -->
            <q-card-section >
          <div v-if="service.emergency === 1">
              <q-chip outline  size="sm" color="red" text-color="white" icon="notification_important">
              Emergency
              </q-chip>

          </div>
            <q-badge :color="service.color">
              {{service.status}}
            </q-badge>         
            </q-card-section>

          </q-item>

          <q-separator />

          <q-card-section horizontal>
            <q-card-section class="col">
              <q-item-label caption>{{service.category}}</q-item-label>
              <div class="row q-mt-sm">
                <q-icon name="place"/>
                <q-item-label>{{service.location}}</q-item-label>
              </div>
            </q-card-section>
            <q-card-actions>
              <div v-if="service.status === 'in progress'" >
                <q-btn class="q-ml-sm" size="md" round flat color="primary" icon="more_horiz" @click="showdetails=true"/>                
                <q-btn class="q-ml-sm" size="md" round flat color="light-green" icon="done" @click="onDone"/>
                <q-btn class="q-ml-sm" size="md" round flat color="red" icon="clear" @click="onCancel" />
              </div>
              <div v-else>
                <q-btn v-if="service.status === 'pending'" round color="primary" icon="add" @click="addRequest"/>
              </div>
            </q-card-actions>            
          </q-card-section>
          <q-dialog v-model="enableotp" persistent transition-show="scale" transition-hide="scale">
                <otpform :text="otp" @success="onOtpSuccess" @Resend="onResend"/>
          </q-dialog>
        </q-card>
        <q-dialog v-model="showdetails">
          <q-card style="min-width: 300px">
            <q-card-section>
              <div class="text-h6">{{service.name}}</div>
            </q-card-section>
            <q-separator/>
            <q-card-section class="q-mt-xm">
               <q-item-label> Desc: {{service.description}}</q-item-label>
               <q-item-label caption class="q-mt-sm"> Date: {{service.requestdate}} </q-item-label>
               <q-item-label caption class="q-mt-sm"> Timeslot: {{service.preferedtimeslot}} </q-item-label>
               <q-item-label caption class="q-mt-sm"> Address: {{service.address}} </q-item-label>               
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" @click="showdetails=false" v-close-popup />
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
props :['service' ],
data(){
  return {
    otp:null,
    cancelreason: '',
    showdetails:false,
    enableotp:false,
    opencalls:0,
    servicecnt:0
  }
},
computed : {
   showMobile(){
     if (this.service.serviceprovider && this.service.status == 'in progress')
        return this.service.mobile
     else
        return 'xxxxxxxxxx'
   }
},
methods :{
    async addRequest(){
      let ustatus = false      
      await this.checkOpencalls()
      await this.checkServiceCountperdat()
      if (this.opencalls > 2){
        this.$q.dialog({
          title: 'Alert',
          message: `${this.$store.state.selectedProvider.name} have 3 open calls already. Not allowed to take a new call`
        }).onDismiss(() => {
          return
        })
      }
      else if(this.servicecnt > 9){
        this.$q.dialog({
          title: 'Alert',
          message: `${this.$store.state.selectedProvider.name} have 3 open calls already. Not allowed to take a new call`
        }).onDismiss(() => {
          return
        })
      }
      else
        ustatus = true

      if (this.$store.state.selectedProvider.walletbalance > (+this.$store.state.service_amt)) {

        let supdate = {
          id: this.service.id,
          serviceprovider: this.$store.state.selectedProvider.id,
          status:'in progress'
        }
        //console.log('ustatus is ' + ustatus)
        if (ustatus) {
          this.$http.put(`${process.env.HOSTNAME}/srequest/${this.service.id}`,supdate)
          .then(response => {
              //console.log(response.data)
              //this.$router.push('/bookinglist')
              if (!this.$store.state.testMode)
                this.sendEngtoCustomerMsg(this.service.name,this.$store.state.selectedProvider.name,this.service.mobile,this.$store.state.selectedProvider.mobile)
          })
          .catch(err => {
            throw(err)
          })
          let newamount = +this.$store.state.selectedProvider.walletbalance - parseInt(this.$store.state.service_amt)
          //console.log('newamount is ' + newamount)
          this.$http.put(process.env.HOSTNAME + '/provider', {id: this.$store.state.selectedProvider.id, amount: newamount})
          .then(res=>{
              this.$q.notify('Wallet updated to ' + newamount + ' for Engineer ' + this.$store.state.selectedProvider.name)
              let value = {
                  providerid: this.$store.state.selectedProvider.id, 
                  amount: newamount,
                  transtype: 'subtract'
              }
              this.$http.post(`${process.env.HOSTNAME}/wallet`,value)
              .then(res => {
                  console.log("wallet transaction added...")
              })              
              this.$http.get(process.env.HOSTNAME + '/provider/' + this.$store.state.selectedProvider.id)
              .then(res => {
                  //console.log('Provider ' + res.data)
                  this.$store.commit('setSelectedProvider', res.data) 
                  //this.$store.dispatch('getBookingList', this.$store.state.selectedProvider.id)
                  this.$emit('UpdateBookingList')
              })
          })
        }
      }
      else {
        this.$q.dialog({
          title: 'Alert',
          message: 'Insufficient balance in the wallet'
        }).onDismiss(() => {
          this.$store.commit('setSelectedTab','Wallet') 
          this.$router.push('/wallet')
        })
      }
    },
    onCancel(){
       this.$q.dialog({
          title: 'Cancel Service',
          message: 'Reason for cancelling',
          prompt: {
            model: '',
            isvalid: val => val.length > 5,
            type: 'text'
          },
          cancel: true,
          persistent: true
        }).onOk(data => {
          this.updateStatus('cancelling:' + data)
          //this.sendCancelMsg(this.service.name,this.service.mobile,this.service.id,data)
        })
    },
    async onDone(){
      if (this.$store.state.testMode)
        this.otp = 1234
      else
        this.otp = await this.sendClosureMsg(this.service.name,this.service.mobile)
      //console.log('OTP is ' + this.otp)
      this.enableotp = true;
    },
    onOtpSuccess(){
      this.enableotp = false;
      this.updateStatus('completed')
    },
    updateStatus(status){
          let cstatus = {
              id: this.service.id, 
              serviceprovider: this.$store.state.selectedProvider.id,
              status:status
          }
          //console.log(cstatus)
          this.$http.put(`${process.env.HOSTNAME}/srequest/${this.service.id}`,cstatus)
          .then(response => {
              this.$q.notify('Status changed to ' + status + ' successfully..')
              //console.log(response.data)
              //this.$store.dispatch('getBookingList', this.$store.state.selectedProvider.id)
              this.$emit('UpdateBookingList')
          })
    },
    async checkOpencalls(){
      try {
          let response = await this.$http.get(`${process.env.HOSTNAME}/opencalls/${this.$store.state.selectedProvider.id}`)
          //console.log('opencalls result: ' + response.data.cnt)
          this.opencalls = response.data.cnt
        }catch(err) {
            console.error(err)
        }
    },
    async checkServiceCountperdat(){
      try {
           let response = await this.$http.get(`${process.env.HOSTNAME}/totalserviceperday/${this.$store.state.selectedProvider.id}`)
            //console.log('totalserviceperday result: ' + response.data.cnt)
            this.servicecnt = response.data.cnt
          }catch(err) {
            console.error(err)
          }
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

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>