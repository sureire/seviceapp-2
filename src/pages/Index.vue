<template>
  <q-page class="constrain-more q-pa-md">
     <!-- <div class="q-pa-md" style="max-width: 500px"> -->
    <div  >
        <!-- <div class="self-center" style="max-width: 500px"> -->
          <q-select rounded outlined bottom-slots v-model="location" label="Location" :options="$store.state.Locations" >
            <template v-slot:prepend>
              <q-icon name="place" />
            </template>
          </q-select>
          <q-select rounded outlined bottom-slots v-model="service" :options="$store.state.Services" label="Services">
            <template v-slot:prepend>
              <q-icon name="construction" />
            </template>
          </q-select>
          <q-btn color="primary" align="right" icon="search" @click.stop="search()" label="Search" />
      <!-- </div> -->
   </div>
     <!-- <div class="q-gutter-md" v-if="showlogin">
       <login :type="$store.state.usertype" />
     </div> -->
  </q-page>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      location: '',
      service: '',
      showlogin: 'false'
    }
  },
  methods: {
    search() {
        this.$store.commit('setSelectedLocation',this.location)
        this.$store.commit('setSelectedService',this.service)
        this.$router.push("/services")
    },
  },
  mounted() {
    if (!this.$store.Locations){
      this.$store.dispatch('getLocations')
      this.$store.dispatch('getCategory')
    }
  }
}
</script>

<style>
.container {
  position: fixed;
  top:25%;
  left:50%;
  transform: translate(-50%,-50%);
  width: 300px;
}
.screencenter {
    /* display: flex; */
    align-items: center;
    justify-content: center;
    max-width: 400px;
    margin: auto; 
    padding-top: 5%;

}
</style>