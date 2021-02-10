<template>
    <div class="q-pa-md">
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
            <q-card-actions align="right">
              <div v-if="service.status === 'in progress'" >
              <q-btn flat round color="light-green" icon="done" @click="onDone"/>
              <q-btn flat round color="red" icon="clear" @click="onCancel" />
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
            <q-badge color="blue">
              {{service.status}}
            </q-badge>         
            </q-card-section>
          </q-card-section>

        </q-card>
    </div>
</template>

<script>
export default {
props :['service' ],
data(){
  return {
    cancelreason: ''
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
            this.$http.get(process.env.HOSTNAME + '/provider/' + this.$store.state.selectedProvider.id)
            .then(res => {
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
            model: this.cancelreason,
            isvalid: val => val.length > 5,
            type: 'text'
          },
          cancel: true,
          persistent: true
        }).onOk(() => {
          let cstatus = {
              id: this.service.id, 
              serviceprovider: this.$store.state.selectedProvider.id,
              status:'cancelled', 
              statusdescription: this.cancelreason
          }
          console.log(cstatus)
              this.$http.put(`${process.env.HOSTNAME}/srequest/${this.service.id}`,cstatus)
              .then(response => {
                  console.log(response.data)
                  this.$store.dispatch('getBookingList', this.$store.state.selectedProvider.id)
              })
        })
    },
    onDone(){
        let supdate = {
          id: this.service.id,
          serviceprovider: this.$store.state.selectedProvider.id,
          status:'completed'
        }
        this.$http.put(`${process.env.HOSTNAME}/srequest/${this.service.id}`,supdate)
        .then(response => {
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