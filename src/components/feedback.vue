<template>
 <q-card  dark >
  <div class="q-pa-md">
    <div class="q-gutter-y-lg column">
      <q-rating
        v-model="service.ratings"
        :max="5"
        size="3.5em"
        color="yellow"
        :icon="icons"
      >
        <template v-slot:tip-1>
            <q-tooltip>Very Bad</q-tooltip>
        </template>
        <template v-slot:tip-2>
            <q-tooltip>Bad</q-tooltip>
        </template>
        <template v-slot:tip-3>
            <q-tooltip>Moderate</q-tooltip>
        </template>        
        <template v-slot:tip-4>
            <q-tooltip>Good</q-tooltip>
        </template>
        <template v-slot:tip-5>
            <q-tooltip>Very good!</q-tooltip>
        </template>        
      </q-rating>
    </div>
    <q-input dark  label="Comments" v-model="service.feedback">
        <template v-slot:prepend>
            <q-icon name="feedback"/>
        </template>
    </q-input> 
    <div class="row">
        <q-icon color="yellow" class="q-ma-sm" size="lg" :name=icons[service.ratings-1] />
        <q-space/>
        <q-btn dark class="q-ma-sm"  label="Ok" @click="onUpdatefeedback()"/>
    </div>
  </div> 
 </q-card> 
</template>

<script>
export default {
    props: ['service'],
  data () {
    return {
      icons: [
        'fas fa-tired',
        'fas fa-frown',
        'fas fa-meh',
        'fas fa-smile',
        'fas fa-grin-stars'
      ]
    }
  },
  methods: {
      onUpdatefeedback(){
        this.$http.put(process.env.HOSTNAME + '/service_feedback', {id: this.service.id, ratings: this.service.ratings, feedback: this.service.feedback})
        .then(res => {
            console.log("updated feedback")
        })
        .catch(err => {
            console.error(err)
        })
        this.$emit('done')
      }
  },
  mounted() {
      if (!this.service.ratings)
            this.service.ratings = 0
  }
}
</script>

<style>

</style>