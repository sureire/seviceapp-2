<template>
   <q-page padding>
       <!-- <q-list bordered separator> -->
        <service v-for="s in selectedServices"
            :key="s.id"
            :service="s" />
       <!-- </q-list> -->
   </q-page>
</template>

<script>
export default {
    data() {
        return {
            selectedServices: ''
        }
    },
components : {
    'service' : require('pages/Servicecard.vue').default
},
mounted() {
    //this.selectedServices = this.$store.state.Providers
     this.selectedServices = this.$store.state.Providers.filter(s => s.location === this.$store.state.selectedlocation)
                                 .filter(s => s.category === this.$store.state.selectedservice)
}

}
</script>

<style>

</style>