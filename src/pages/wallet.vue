<template>
  <q-page padding class="q-pa-md constrain-more">
    <q-card class="my-card q-pa-md">
      <q-card-section class="bg-primary text-white" align="right">
        <div class="text-subtitle2">Wallet Balance</div>
        <div class="text-h6">₹ {{provider.walletbalance}}</div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
          <q-input class="col" v-model="amount" type="number" prefix="₹" align="left"/>
        <q-btn class="col" color="primary" outline icon="add" @click="onAdd">Add & Pay </q-btn>
      </q-card-actions>
      <q-card-section>
          <div v-if="testMode">
              <p>use Visa: 4111 1111 1111 1111 </p>
              <p>Exp: 12/21</p>
              <p>CVV: 123 </p>
          </div>
      </q-card-section>
    </q-card>      
  </q-page>
</template>

<script>


export default {
data(){
    return {
        provider : this.$store.state.selectedProvider,
        amount: null,
        paydata : {
          amount: null,
          name: null,
          email: null,
          phone: null,
          status: null
        }
    }
},
computed : {
    testMode(){
      return process.env.RAYZORPAYMODE === 'Test'
    }
},
methods: {
    onAdd(){
        if (this.amount){

            this.onRazorPay(this.amount)
        }
    },
    onRazorPay(amt){
        this.$q.loading.show()
        this.paydata.amount = amt
        this.paydata.name = this.provider.name
        this.paydata.email = this.provider.email
        this.paydata.phone = this.provider.mobile
        this.paydata.status = 'pending'

        this.$http.post(`${process.env.HOSTNAME}/createPayment`,this.paydata)
            .then(res => {
                console.log("response from createPayment")
                console.log(res.data.order)
                  let order = res.data.order;
                  var options = {
                      // key_id: "rzp_test_u2D4dnRU0hFi9j",
                      // key_secret: "BxHSoL8VJz3UQudYckOIRLQt",
                      amount: order.amount_due, 
                      currency: order.currency, 
                      description: "Payment description ",
                      order_id: order.id,
                      name:"VPlusU",
                      prefill: {
                          name: this.paydata.name,
                          email: this.paydata.email,
                          contact: this.paydata.phone
                      },
                      theme: {
                          color: "#ffcc00"
                      },
                      handler:  (response) =>{
                          this.verifySignature(response)
                      },
                  }
                  console.log(options)
                  var rzp = new Razorpay(options)
                  rzp.open();
            })
            .catch(error => {
                    this.$q.loading.hide()
                    console.log(error)
            })
    },
    verifySignature(response){
        this.$http.post(`${process.env.HOSTNAME}/verifyPayment`,response)
        .then(res => {
            this.$q.notify('Payment Successfull !!')
            let value = {
                providerid: this.provider.id, 
                amount: this.amount,
                transtype: 'add'
            }
            this.$http.post(`${process.env.HOSTNAME}/wallet`,value)
            .then(res => {
                console.log("wallet transaction added...")
            })
            let newamount = +this.amount + +this.provider.walletbalance
            console.log('newamount is ' + newamount)
            this.$http.put(process.env.HOSTNAME + '/provider', {id: this.provider.id, amount: newamount})
            .then(res=>{
                this.$q.notify('Wallet updated for Engineer ' + this.provider.name + ' with amount $' + newamount)
                this.provider.walletbalance = newamount
                this.$store.commit('setSelectedProvider', this.provider) 
                this.amount = null
            })
            this.$q.loading.hide()
        })
        .catch(err => {
          this.$q.loading.hide()
          console.error(err)
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