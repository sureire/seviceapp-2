<template>

      <q-card style="width: 300px">
        <q-toolbar>
          <q-icon size="md" name="mdi-cellphone-key" />

          <q-toolbar-title>Enter OTP for login</q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pt-none">
          <q-input type="number" outlined dense v-model.number="otp" name="txtotp" autofocus :rules="[val => !!val|| 'OTP is Invalid!!']" @keyup.enter="onOK" >
     
          </q-input>
        </q-card-section>

        <q-card-actions align="around" class="bg-white text-teal">
          <q-btn flat label="Resend OTP" v-close-popup @click.stop="$emit('Resend')"/>
          <q-btn flat label="OK" @click.stop="onOK"/>
        </q-card-actions>
        <!-- <q-card-section class="q-pt-none">
          <q-input type="number" outlined dense v-model.number="otp" autofocus :rules="[val => !!val || 'OTP is Empty!!']" @keyup.enter="onOK"/>
        </q-card-section> -->
      </q-card>

</template>

<script>
export default {
    props: ['text'],
    data() {
        return {
            otp:null ,
            iserror:false
        }
    },
    methods: {
        onOK(){
            console.log(this.text)
            console.log(this.otp)
            if (!this.otp)
              return
            this.iserror = false
            if (this.otp == this.text) {
              console.log('emiting success')
              this.$emit('success')
            }
            else {
              this.otp = null
              this.$refs.txtotp.validate()
            }
            //on successfull validation emit success
        }
    }

}
</script>

<style>

</style>