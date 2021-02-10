<template>
<div class="q-pa-sm"> 
<q-card >
  <q-item >
        <q-item-section>
          <q-item-label overline>Date: {{request.requestdate}}</q-item-label>
          <q-item-label>{{request.name}}</q-item-label>
          <q-item-label caption>Availability: {{request.preferedtimeslot}}</q-item-label>
          <div v-if="request.emergency">
              <q-chip outline color="red" size="sm" text-color="white" icon="notification_important">
                Emergency
              </q-chip>
          </div>
        </q-item-section>

        <q-item-section side bottom>
            <q-badge color="blue">
              {{request.status}}
            </q-badge>
          <!-- <q-item-label caption>Status: {{request.status}}</q-item-label> -->
        </q-item-section>
  </q-item>
</q-card>
</div>
</template>

<script>
export default {
  props: ['request']

}
</script>
