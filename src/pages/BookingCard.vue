<template>
    <q-card class="my-card" bordered>
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label v-if="service.serviceprovider">{{service.mobile}}</q-item-label>
              <q-item-label v-else>xxxxxxxxxxxx</q-item-label>
              <q-item-label caption>
                {{service.name}}
              </q-item-label>
            </q-item-section>
            <q-card-actions >
              <div v-if="service.status === 'in progress'" >
                <q-btn size="md" round color="light-green" icon="done" @click="onDone" style="margin-bottom: 5px"/>
                <q-space/>
                <q-btn size="md" round color="red" icon="clear" @click="onCancel" />
              </div>
              <div v-else>
                <q-btn v-if="service.status === 'pending'" round color="primary" icon="add" @click="addRequest"/>
              </div>
            </q-card-actions>
          </q-item>

          <q-separator />

          <q-card-section horizontal>
            <q-card-section class="col-6">
              <q-item-label caption>{{service.category}}</q-item-label>
              <div class="flex q-pa-sm">
                <q-icon name="place"/>
                <q-item-label>{{service.location}}</q-item-label>
              </div>
              <q-item-label>{{service.description}}</q-item-label>
            </q-card-section>



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
          </q-card-section>
          <q-dialog v-model="enableotp" persistent transition-show="scale" transition-hide="scale">
                <otpform text='Enter OTP for login' @success="onOtpSuccess"/>
          </q-dialog>
        </q-card>
</template>

<script>
export default {
    components :{
        'otpform' : require('components/otpform.vue').default
    },  
props :['service' ],
data(){
  return {
    cancelreason: '',
    enableotp:false
  }
},
methods :{
    addRequest(){
      if (this.$store.state.selectedProvider.walletbalance > 100) {
        let supdate = {
          id: this.service.id,
          serviceprovider: this.$store.state.selectedProvider.id,
          status:'in progress'
        }
        this.$http.put(`${process.env.HOSTNAME}/srequest/${this.service.id}`,supdate)
        .then(response => {
            console.log(response.data)
            //this.$router.push('/bookinglist')
        })
        .catch(err => {
          throw(err)
        })
        let newamount = +this.$store.state.selectedProvider.walletbalance - 100
        console.log('newamount is ' + newamount)
        this.$http.put(process.env.HOSTNAME + '/provider', {id: this.$store.state.selectedProvider.id, amount: newamount})
        .then(res=>{
            this.$q.notify('Wallet updated to ' + newamount + ' for Engineer ' + this.$store.state.selectedProvider.name)
            this.$http.get(process.env.HOSTNAME + '/provider/' + this.$store.state.selectedProvider.id)
            .then(res => {
                console.log('Provider ' + res.data)
                this.$store.commit('setSelectedProvider', res.data) 
                this.$store.dispatch('getBookingList', this.$store.state.selectedProvider.id)
            })
        })
      }
      else {
        this.$q.dialog({
          title: 'Alert',
          message: 'Insufficient balance in the wallet'
        }).onDismiss(() => {
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
          alert(data)
          this.updateStatus('cancelling:' + data)
        })
    },
    onDone(){
      this.enableotp = true;
    },
    onOtpSuccess(){
      this.updateStatus('completed')
    },
    updateStatus(status){
          let cstatus = {
              id: this.service.id, 
              serviceprovider: this.$store.state.selectedProvider.id,
              status:status
          }
          console.log(cstatus)
          this.$http.put(`${process.env.HOSTNAME}/srequest/${this.service.id}`,cstatus)
          .then(response => {
              this.$q.notify('Status changed to ' + status + ' successfully..')
              console.log(response.data)
              this.$store.dispatch('getBookingList', this.$store.state.selectedProvider.id)
          })
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 300px
</style>