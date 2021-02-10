<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          VplusU
        </q-toolbar-title>

        
      </q-toolbar>
      <div v-if="$store.state.usertype === 'User'">
        <q-tabs  no-caps v-model="$store.state.selectedTab" class="bg-grey-3 text-black shadow 2">
          <q-tab v-if="!$store.state.selectedUser.name" name="LoginUser" icon="login" label="Login" @click="onLogin" />
          <q-tab v-if="$store.state.selectedUser.name" name="Person" icon="person" @click="onLogin">
            {{$store.state.selectedUser.name}}
          </q-tab>
          <q-tab name="Search" icon="search" label="Search" @click="onSearch" />
          <q-tab name="Services" icon="toys" label="My List" @click="$router.push('/userrequests')" />
        </q-tabs>
      </div>
      <div v-else>
        <q-tabs  no-caps dense>
          <q-tab v-if="!$store.state.selectedProvider.name" name="Loginprovider" icon="login" label="Login" @click="onLogin" />
          <q-tab v-if="$store.state.selectedProvider.name" name="Person" icon="person" @click="onLogin">
            {{$store.state.selectedProvider.name.substring(0,8)}}
          </q-tab>
          <q-tab name="MyServices" icon="engineering" label="Services" @click="onServices" />
          <q-tab name="Bookinglist" icon="receipt_long" label="Booking List" @click="$router.push('/bookinglist')" />
          <q-tab name="Wallet" icon="attach_money" label="Wallet" @click="$router.push('/wallet')"/>
        </q-tabs>
      </div>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
          @click="onChangeType"
        >
          {{$store.state.usertype}}
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  components: {  },
  data () {
    return {
      leftDrawerOpen: false,
    }
  },
  methods:{
        onLogin(){
      this.$router.push('/login')
    },
    onSearch(){
      this.$router.push('/')
    },
    onServices(){
      if (this.$store.state.selectedProvider)
        this.$router.push('/providerservices')
      else
        this,$router.push('/login')
    },
    onChangeType() {
      if (this.$store.state.usertype === 'User')
        this.$store.commit('setLoginType','Provider')
      else
        this.$store.commit('setLoginType','User')
    }
  },
  mounted() {
      this.$store.commit('setLoginType',process.env.USERTYPE)
  }
}
</script>
