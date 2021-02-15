<template>
  <q-page padding>
      <q-card class="auth-tabs">
        <div v-if="!register">
          <login-page :usertype="$store.state.usertype"/>
        <q-separator />
        <q-banner rounded class="bg-white text-black">
            <span class="q-pa-md">New {{$store.state.usertype}} click </span>
            <!-- <template v-slot:action> -->
                <q-btn rounded icon="person_add" color="primary" label="Register" @click="register=true"/>
            <!-- </template> -->
        </q-banner>          
        </div>
        <div v-else>
            <register-page :usertype="$store.state.usertype"/>
        </div>
      </q-card>
  </q-page>
</template>

<script>
export default {
    components : {
        'login-page' : require('components/Login.vue').default,
        'register-page' : require('components/Register.vue').default
    },
    data(){
        return {
            usertype: null,
            register: false
        }
    },
    mounted() {
        this.usertype = this.$store.state.usertype
    },
}
</script>

<style>
  .auth-tabs {
    max-width: 400px;
    margin: 0 auto;
  }
</style>