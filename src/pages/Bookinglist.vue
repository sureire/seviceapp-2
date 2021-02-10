<template>
  <q-page padding>
    <div v-if="$store.state.BookingList" class="q-pa-md">
        <bookingcard v-for="r in $store.state.BookingList"
            :key="r.id"
            :service="r" />
    </div>
    <div v-else class="q-pa-lg flex flex-center">
            No Service Request found
    </div>
  </q-page>
</template>

<script>
export default {
   components : {
        'bookingcard' : require('pages/BookingCard.vue').default
   },
   data(){
       return {
        services:[]
       }
   },
   methods: {
        addSer(){
          this.$router.push('/newrequest')
        }
   },
   mounted() {
      this.$store.dispatch('getBookingList', this.$store.state.selectedProvider.id)
  }
}
</script>

<style>

</style>