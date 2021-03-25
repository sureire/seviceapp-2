<template>
  <q-page class="constrain q-pa-md">
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
          <div class="row">
            <q-space/>
            <q-btn color="primary" align="right" icon="search" @click.stop="search()" label="Search" />
          </div>
      <!-- </div> -->
   </div>

    <div class="q-mt-xl">
      <q-carousel
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        infinite
        :autoplay="autoplay"        
        animated
        control-color="primary"
        navigation
        arrows
        class="shadow-2 rounded-borders"
      >
        <q-carousel-slide :name="1" class="column no-wrap">
          <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
            <q-img class="rounded-borders col-6 full-height" contain src="~assets/1.jpeg" />
            <q-img class="rounded-borders col-6 full-height" contain src="~assets/2.jpeg" />
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="2" class="column no-wrap">
          <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
            <q-img class="rounded-borders col-6 full-height" contain src="~assets/3.jpeg" />
            <q-img class="rounded-borders col-6 full-height" contain src="~assets/4.jpeg" />
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="3" class="column no-wrap">
          <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
            <q-img class="rounded-borders col-6 full-height" contain src="~assets/5.jpeg" />
            <q-img class="rounded-borders col-6 full-height" contain src="~assets/6.jpeg" />
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="4" class="column no-wrap">
          <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
            <q-img class="rounded-borders col-6 full-height" contain src="~assets/7.jpeg" />
            <q-img class="rounded-borders col-6 full-height" contain src="~assets/8.jpeg" />
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="5" class="column no-wrap">
          <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
            <q-img class="rounded-borders col-6 full-height" contain src="~assets/9.jpeg" />
            <q-img class="rounded-borders col-6 full-height" contain src="~assets/10.jpeg" />
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="6" class="column no-wrap">
          <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
            <q-img class="rounded-borders col-6 full-height" contain src="~assets/11.jpeg" />
            <q-img class="rounded-borders col-6 full-height" contain src="~assets/12.jpeg" />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-page>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      location: '',
      service: '',
      showlogin: 'false',
      slide: 1,
      autoplay: true
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
      this.$store.dispatch('getSettings')
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