<template>
<div class="q-pa-sm"> 
<q-card >
  <q-item >
        <q-item-section>
          <div v-if="request.name">
            <q-item-label> {{request.name}}</q-item-label>  
          </div>
          <q-item-label overline>Date: {{request.requestdate}}</q-item-label>
          <q-item-label>{{request.category}}</q-item-label>
          <q-item-label>
            <q-icon name="place"/>
            {{request.location}}</q-item-label>
          <q-item-label caption>Availability: {{request.preferedtimeslot}}</q-item-label>
          <div v-if="request.emergency">
              <q-chip outline color="red" size="sm" text-color="white" icon="notification_important">
                Emergency
              </q-chip>
          </div>
        </q-item-section>

        <q-item-section side bottom>
            <q-badge :color="request.color">
              {{request.status}}
            </q-badge>
          <!-- <q-item-label caption>Status: {{request.status}}</q-item-label> -->
            <div v-if="showRatingIcon">
                <q-btn color="yellow-10" flat round :icon="pickemoji" @click="showfeedback=true" />
            </div>
        </q-item-section>
  </q-item>
</q-card>
  <q-dialog v-model="showfeedback" persistent transition-show="scale" transition-hide="scale">
      <feedbackform :service="request" @done="onFeedback"/>
  </q-dialog>  
</div>
</template>

<script>
export default {
  props: ['request'],

    components :{
        'feedbackform' : require('components/feedback.vue').default,
    }, 
    computed:{
      showRatingIcon(){
        if (this.request.status == 'completed' || this.request.status == 'cancelled')
          return true
        else
          return false
      },
      pickemoji(){
        //console.log('ratings is ' + this.request.ratings)
        if (!this.request.ratings || this.request.ratings == 0){
          this.request.ratings = 0
          return 'far fa-comment-dots'
        }
        else {
            return this.icons[this.request.ratings-1]
        }

      }
    }, 
  data(){
    return {
      showfeedback: false,
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
    onFeedback(){
      this.showfeedback = false
    }
  }


}
</script>
