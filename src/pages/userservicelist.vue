<template>
  <q-page padding>
    <div v-if="services.length" class="q-pa-md">
        <userservicecard v-for="r in services"
            :key="r.id"
            :request="r" />
    </div>
    <div v-else class="q-pa-lg flex flex-center">
            No Service Request found
    </div>
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
      this.$http.get(`${process.env.HOSTNAME}/srequest_user/${this.$store.state.selectedUser.id}`)
      .then(response => {
          this.services = response.data
      })
      .catch(err => {
          throw(err)
      })
  }
}
</script>

<style>

</style>