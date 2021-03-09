<template>
  <q-page padding class="constrain-more">
      <q-form >
            <q-field rounded filled  stack-label>
                <template v-slot:control>
                <div class="self-center full-width " tabindex="0">Add a Service</div>
                </template>
            </q-field>
            <q-separator spaced="md"/>
            <q-input
                outlined
                v-model="service.name"
                ref = "name"
                label="Service Name"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type Service name']"
            />
            <q-select color="primary" v-model="service.category" :options="$store.state.Services" label="Category">
                <template v-slot:prepend>
                <q-icon name="construction" />
                </template>
            </q-select>
            <q-select 
                color="primary" v-model="service.location" :options="$store.state.Locations" label="Location">
                <template v-slot:prepend>
                <q-icon name="place" />
                </template>
            </q-select>
            <q-separator spaced="md"/>
            <q-btn  color="primary" icon="add" label="Add" @click="onAdd" />
      </q-form>
  </q-page>
</template>

<script>
export default {

data(){
    return {
        service : {
            name: null,
            category: null,
            location: null,
            providerid: this.$store.state.selectedProvider.id
        }
    }
},
methods: {
    onAdd(){
        console.log(this.service)
        if (!this.service.name || !this.service.category || !this.service.location)
            this.$q.notify('Missing fields in Add Service. Please add all the details...')
        else {
            this.$q.loading.show()
            this.$http.post(process.env.HOSTNAME + '/service', this.service)
            .then(res => {
                this.$q.loading.hide()
                this.$router.push('/providerservices')
            })
            .catch(err => {
                this.$q.loading.hide()
                throw(err)
            })
        } 
    }
},
mounted() {
    //this.$http.get()
}

}
</script>

<style>

</style>