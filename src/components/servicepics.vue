<template>
  <q-card style="width: 100%" >
          <q-btn class="AClass" flat round icon="close" color="black" v-close-popup />  
    <q-carousel
      swipeable
      animated
      arrows
      v-model="slide"
      :fullscreen.sync="fullscreen"
       infinite
    >

      <q-carousel-slide v-for="(p, i) in picsurl"
        :key="p.name" :name="i" :img-src="p" />
      <!-- <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
      <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
      <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/quasar.jpg" /> -->

      <template v-slot:control>
        <q-carousel-control
        position="top-right"
        :offset="[18, 18]"
        >
          <q-btn
              push flat round dense text-color="primary"
              icon="close"
              v-close-popup
          />
        </q-carousel-control>
        <q-carousel-control
        position="bottom-right"
        :offset="[50, 18]"
        >
          <q-btn
              push round dense text-color="primary"
              icon="delete"
              @click="deletepic"
          />
        </q-carousel-control>
        <q-carousel-control
          position="bottom-right"
          :offset="[18, 18]"
        >
          <q-btn
            push round dense  text-color="primary"
            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="fullscreen = !fullscreen"
          />
        </q-carousel-control>
      </template>
    </q-carousel>
    <q-card-section v-if="piccnt < 3">
        <div class="row justify-center">
            <q-file
            v-model="files"
            label="Upload Images"
            filled
            multiple
            accept=".jpg, image/*"
            max-files="1"
            style="max-width: 300px"
            >
                <template v-slot:prepend>
                    <q-icon name="cloud_upload" />
                </template>
            </q-file>
            <q-btn class="q-ma-sm" round color="primary" icon="add_a_photo" @click="addpic"/>
        </div>
    </q-card-section>
   </q-card> 
</template>
<script>
import {fsstorage } from 'boot/firebase'

export default {
    props :['service' ],
  data () {
    return {
      slide: 0,
      picsurl: [],
      fullscreen: false,
      piccnt: null,
      files: null,
      picnames: [],
      uploadValue: 0
    }
  },
  mounted() {
      console.log(this.service)
      this.loadpics()

 },
 methods: {
     addpic(){
              if (this.files){
                  this.files.forEach(e => {
                      console.log(e)
                      const sref = fsstorage.ref(`ServiceReqPics/${this.service.id}/${e.name}`).put(e)
                      sref.on(`state_changed`, snapshot => {
                          this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100
                      }, error => {console.error(error.message)}, 
                      () =>{ this.uploadValue =100
                              this.files = null
                              this.loadpics()
                           })                      
                  })
              }
     },
     deletepic(){
        console.log('slide is: ' + this.slide)
        console.log(this.picsurl[this.slide])
        console.log(this.picnames[this.slide])
        const sref = fsstorage.ref()
        sref.child(this.picnames[this.slide]).delete()
        .then(() => {
          console.log("file deleted")
          this.loadpics()
        })
        .catch((e) => {
          console.error(e)
        })
     },
     loadpics(){
       this.picnames = []
       this.picsurl = []
        const sref = fsstorage.ref();
        console.log(`ServiceReqPics/${this.service.id}`)
        var dref = sref.child(`ServiceReqPics/${this.service.id}`)
        dref.listAll().then(res => {
            
            if (res.items.length > 0){
                this.piccnt = res.items.length
                console.log(this.piccnt)
                  res.items.forEach(e=>{
                      this.picnames.push(e.fullPath)
                      e.getDownloadURL().then(url => {
                        this.picsurl.push(url)
                      })
                  })
            }
        })
     }
 }

}
</script>

