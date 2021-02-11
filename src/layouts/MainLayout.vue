<template>
  <q-layout view="lHh Lpr lFf" class="shadow-2 rounded-borders">
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
        <q-tabs  no-caps dense class="bg-grey-3 text-black shadow 2">
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
        :width="200"
        :breakpoint="500"
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding class="menu-list">
            <q-item clickable v-ripple @click="$store.commit('setLoginType','User')">
              <q-item-section avatar>
                <q-icon name="mdi-account" />
              </q-item-section>

              <q-item-section>
                User
              </q-item-section>
            </q-item>

            <q-item active clickable v-ripple @click="$store.commit('setLoginType','Provider')">
              <q-item-section avatar>
                <q-icon name="mdi-account-hard-hat" />
              </q-item-section>

              <q-item-section>
                Engineer
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="group_work" />
              </q-item-section>

              <q-item-section>
                Dealer
              </q-item-section>
            </q-item>

          </q-list>
        </q-scroll-area>
        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <!-- <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar> -->
          </div>
        </q-img>
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

<style lang="sass" scoped>
.menu-list .q-item
  border-radius: 0 32px 32px 0
</style>