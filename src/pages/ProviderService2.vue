<template>
        <q-page padding class="constrain-more">
          <div v-if="services.length" class="q-pa-md">
            <service v-for="s in services"
                :key="s.id"
                :service="s" />
          </div>
          <div v-else class="q-pa-lg flex flex-center">
              Add a new Service
          </div>
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="accent" @click="addSer"/>
          </q-page-sticky> 
      </q-page>
</template>

<script>
export default {
    components : {
    'service' : require('pages/Servicecard.vue').default
    },
    data(){
        return {
            services: []
        }
    },
    methods: {
        addSer(){
            console.log('reached')
          this.$router.push('/addservice')
        }
    },
    mounted() {
      console.log(this.$store.state.selectedProvider.id)
      this.$http.get(`${process.env.HOSTNAME}/services/${this.$store.state.selectedProvider.id}`)
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