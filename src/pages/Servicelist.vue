<template>
  <q-page padding class="constrain-more">
    <div v-if="services.length" class="q-pa-sm">
        <span><h2 style="color:darkgreen;font-weight: bold;"> {{services.length}} </h2> <h5>service(s) found for {{this.$store.state.selectedservice}}</h5></span>        
        <p><h5> in {{$store.state.selectedlocation}} </h5></p>
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
           //console.log('from addService')
           this.$router.push('/newrequest')
       }
   },
   mounted() {
              this.$q.loading.show()
     this.$http.get(`${process.env.HOSTNAME}/serbyloccat/${this.$store.state.selectedlocation}/${this.$store.state.selectedservice}`)
      .then(response => {
          this.services = response.data
          this.$q.loading.hide()
      })
      .catch(err => {
          this.$q.loading.hide()
          throw(err)
      })
  }

}
</script>

<style>

</style>