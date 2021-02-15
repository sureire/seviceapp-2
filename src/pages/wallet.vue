<template>
  <q-page padding class="q-pa-md constrain-more">
    <q-card class="my-card q-pa-md">
      <q-card-section class="bg-primary text-white" align="right">
        <div class="text-subtitle2">Wallet Balance</div>
        <div class="text-h6">$ {{provider.walletbalance}}</div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
          <q-input  v-model="amount" type="number" prefix="$" align="right"/>
        <q-btn color="primary" outline icon="add" @click="onAdd">Add</q-btn>
      </q-card-actions>
    </q-card>      
  </q-page>
</template>

<script>
export default {
data(){
    return {
        provider : this.$store.state.selectedProvider,
        amount: null
    }
},
methods: {
    onAdd(){
        if (this.amount){
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
        }
    }
}

}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 300px
</style>