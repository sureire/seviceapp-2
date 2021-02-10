<template>
  <q-page padding>
    <div v-if="services.length" class="q-pa-sm">
        <span><h3> {{services.length}} </h3> <h5>service found for {{this.$store.state.selectedservice}}</h5></span>
        <div class="q-gutter-sm">
            <q-btn label="Create Service Request" color="primary" icon="create" @click="addService"/>
        </div>
            
    </div>
    <div v-else class="q-pa-lg flex flex-center">
            No Service found
    </div>
  </q-page>
</template>

<script>
export default {
   components : {
        'service' : require('pages/Servicecard.vue').default
   },
   data(){
       return {
        services:[]
       }
   },
   methods: {
       addService(){
           console.log('from addService')
           this.$router.push('/newrequest')
       }
   },
   mounted() {
      this.$http.get(`${process.env.HOSTNAME}/serbyloccat/${this.$store.state.selectedlocation}/${this.$store.state.selectedservice}`)
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