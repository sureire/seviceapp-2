<template>
  <q-page padding class="constrain-more">
    <div v-if="services.length" class="q-pa-md">
        <userservicecard v-for="r in services"
            :key="r.id"
            :request="r" />
    </div>
    <div v-else class="q-pa-lg flex flex-center">
            No Service Request found
    </div>
    <div class="row"></div>
      
    <!-- <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" color="accent" @click="addSer"/>
    </q-page-sticky>  -->
  </q-page>
</template>

<script>
export default {
   components : {
        'userservicecard' : require('pages/userservicereqcard.vue').default
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
     try {
      this.$q.loading.show()
     let url = 'srequest_user'
     if (this.$store.state.usertype === 'Dealer')
        url = 'dealersr'
      this.$http.get(`${process.env.HOSTNAME}/${url}/${this.$store.state.selectedUser.id}`)
      .then(response => {
          this.services = response.data
          this.$q.loading.hide()
      })
      .catch(err => {
              this.$q.loading.hide()
          throw(err)
      })
     }catch(e) {
       this.$q.loading.hide()
     }

  }
}
</script>

<style>

</style>