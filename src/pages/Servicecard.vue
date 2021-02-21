<template>
    <div class="q-pa-md">
    <q-card class="my-card" bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-h5 q-mt-sm q-mb-xs">{{service.name}}</div>
          <div class="text-overline">{{service.category}}</div>
          <q-item-label>
            <q-icon name="place"/>
            {{service.location}}</q-item-label>          
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            src="/assets/appliances.jpg"
          />
        </q-card-section>
      </q-card-section>

      <q-separator />

      <!-- <q-card-actions align="around">
        <q-btn flat round icon="place">
            {{service.location}}
        </q-btn>
        <div v-if="usertype === 'User'">
        <q-btn icon="add" @click="addRequest">Add</q-btn>
        </div>
      </q-card-actions> -->
    </q-card>
    </div>
</template>

<script>
export default {
props :['service' ],
data() {
  return{
      usertype: this.$store.state.usertype
  }
},
methods :{
    addRequest(){
      this.$store.commit('setSelectedService',this.service)
      if (!this.$store.state.selectedUser)
        this.$router.push('/login')
      else
        this.$router.push('/newrequest')
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 400px
</style>