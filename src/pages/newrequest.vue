<template>
  <q-page padding class="q-gutter-md">
    <q-chip size="18px" icon="bookmark">
        New Service Request for {{$store.state.selectedservice}}
    </q-chip>
    <div  class="q-pa-md" style="max-width: 350px">
        <q-input  v-model="newRequest.requestdate" label="Requested Date" mask="date" :rules="['date']">
        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="newRequest.requestdate">
                <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
                </q-date>
            </q-popup-proxy>
            </q-icon>
        </template>
        </q-input>
        <q-input v-model="newRequest.description" label="Service Description" />
        <q-select class="q-pa-xs" v-model="newRequest.preferedtimeslot" :options="timeslot" label="Pick a TimeSlot" />
        <q-toggle class="q-pa-md" v-model="newRequest.emergency" color="red" label="Emergency" />
        <div class="q-pa-xs">
            <q-btn icon="add_alert" label="Create" color="primary" @click="onCreate"/>
        </div>
    </div>

  </q-page>
</template>

<script>
export default {
    data() {
        return {
            newRequest :{
                userid: this.$store.state.selectedUser.id,
                category: this.$store.state.selectedservice,
                location: this.$store.state.selectedlocation,
                requestdate: '',
                status: 'pending',
                preferedtimeslot: '',
                emergency: false,
                description: ''
            },
            timeslot :['Morning', 'Afternoon', 'Evening' ] 
        }
    },

    methods: {
        onCreate(){
            this.$http.post(process.env.HOSTNAME + '/srequest', this.newRequest)
            .then(Response => {
                this.$store.commit('setSelectedProvider',Response.data)
                this.$router.push('/userrequests')
            })
            .catch(err => {
                throw(err)
            })
        }
    }

}
</script>

<style>

</style>