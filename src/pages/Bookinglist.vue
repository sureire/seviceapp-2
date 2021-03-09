<template>
  <q-page padding class="constrain-more ">
    <q-option-group
      v-model="group"
      :options="options"
      color="primary"
      inline
      dense
      @input="setFilter"
    />    
    <div v-if="services" class="q-pa-sm">
        <bookingcard v-for="r in services"
            :key="r.id"
            :service="r"
            @UpdateBookingList="onBookingListUpdate" />
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
        services:[],
        allservices:[],
        group: 'all',
        options: [
          {
            label: 'All',
            value: 'all'
          },
          {
            label: 'In Progress',
            value: 'in progress'
          },
          {
            label: 'Pending',
            value: 'pending'
          },
          {
            label: 'Completed',
            value: 'completed'
          },
          {
            label: 'Cancelled',
            value: 'cancelled'
          }
        ]        
       }
   },
   methods: {
        addSer(){
          this.$router.push('/newrequest')
        },
        setFilter(){
         if (this.group == 'all')
            this.services = this.allservices
          else
            this.services = this.allservices.filter( a=> a.status == this.group)
        },
        async onBookingListUpdate(){
            this.LoadBookingList()
        },
        async LoadBookingList() {
            if (this.$store.state.selectedProvider) {
              this.$q.loading.show()
              try {
                let res = await this.$http.get(`${process.env.HOSTNAME}/srequest_bookinglist/${this.$store.state.selectedProvider.id}`)
                  this.services = res.data[0]
                  this.allservices = res.data[0]
              }catch(err) {
                    throw(err)
              }
              console.log('service length is ' + this.services.length)
              this.$q.loading.hide()
          }
        }
   },
   created() {
      this.services = null
      //this.$store.dispatch('getBookingList', )
   },
   async mounted() {
      this.LoadBookingList()
  }
}
</script>

<style>

</style>