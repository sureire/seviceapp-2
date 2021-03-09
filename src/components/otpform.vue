<template>

      <q-card style="width: 300px">
        <q-toolbar>
          <q-icon size="md" name="mdi-cellphone-key" />

          <q-toolbar-title>{{text}}</q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pt-none">
          <q-input type="number" outlined dense v-model.number="otp" autofocus @keyup.enter="onOK"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup @click.stop="onOK"/>
        </q-card-actions>
      </q-card>

</template>

<script>
export default {
    props: ['text'],
    data() {
        return {
            otp: null
        }
    },
    methods: {
        onOK(){
            //on successfull validation emit success
            this.$emit('success')
        }
    }

}
</script>

<style>

</style>