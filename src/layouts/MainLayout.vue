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
        <q-space />
        <q-field dark borderless>
          <template v-slot:control>
            <div class="self-center no-outline" tabindex="0">{{showSelectedPerson}}</div>
          </template>
        </q-field>
                
      </q-toolbar>
      <div v-if="$store.state.usertype === 'User' || $store.state.usertype === 'Dealer'">
        <q-tabs  no-caps dense v-model="$store.state.selectedTab" class="bg-teal text-grey-5 shadow-2" active-color="white">
          <q-tab name="LoginUser" :icon="showloginIcon" :label="showloginStatus" @click="onLogin" />
          <!-- <q-tab v-if="$store.state.selectedUser.name" name="Person" icon="person" @click="onLogin">
            {{$store.state.selectedUser.name}}
          </q-tab> -->
          <q-tab name="Search" icon="search" label="Search" @click="onSearch" />
          <q-tab name="Services" icon="toys" label="My List" @click="$router.push('/userrequests')" />
        </q-tabs>
      </div>
      <div v-else>
        <q-tabs  no-caps dense v-model="$store.state.selectedTab" class="bg-teal text-grey-5 shadow-2" active-color="white">
          <q-tab name="Loginprovider" :icon="showloginIcon" :label="showloginStatus" @click="onLogin" />
          <!-- <q-tab v-if="$store.state.selectedProvider.name" name="Person" icon="person" @click="onLogin">
            {{$store.state.selectedProvider.name.substring(0,8)}}
          </q-tab> -->
          <q-tab name="MyServices" icon="engineering" label="Services" @click="onServices" />
          <q-tab name="Bookinglist" icon="receipt_long" label="Booking List" @click="$router.push('/bookinglist')" />
          <q-tab name="Wallet" icon="attach_money" label="Wallet" @click="$router.push('/wallet')"/>
        </q-tabs>
      </div>
    </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        :width="180"
        :breakpoint="500"
        content-style="background-color: #fcfcd7"
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding class="menu-list">
            <q-item v-for="item in MenuList" :key="item.name" :name="item.name"  :active="item.active" 
            clickable v-ripple @click="onMenuClick(item)" active-class="bg-teal-1 text-primary" >
              <q-item-section avatar>
                <q-icon :name="item.icon" />
              </q-item-section>

              <q-item-section>
                {{item.name}}
              </q-item-section>
            </q-item>

            <!-- <q-item active clickable v-ripple @click="$store.commit('setLoginType','Provider')">
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
            </q-item> -->

          </q-list>
        </q-scroll-area>
        <q-img class="absolute-top" contain :src="imagesrc" @click="onLogoClick" style="height: 120px">
          <!-- <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="/assets/logo.jpeg">
            </q-avatar>
          </div> -->
        </q-img>
      </q-drawer>
      <q-footer elevated class="bg-teal" style="height:80px;">
        <q-toolbar class="row justify-center" >
            <q-btn flat rounded label="About Us" @click="showaboutus=true" text-color="white"/>
            <q-btn flat rounded label="Contact Us" @click="showcontactus=true" text-color="white"/>
            <q-btn flat rounded label="Privacy Policy" @click="showprivacy=true" text-color="white"/>
        </q-toolbar>
      </q-footer>
      <q-dialog v-model="showcontactus" transition-show="rotate" transition-hide="rotate">
        <contact-us />
      </q-dialog>
      <q-dialog v-model="showaboutus" transition-show="rotate" transition-hide="rotate">
        <about-us />
      </q-dialog>
      <q-dialog v-model="showprivacy" transition-show="rotate" transition-hide="rotate">
        <privacy-policy />
      </q-dialog>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  components: { 
      'contact-us' : require('pages/Contactus.vue').default,
      'about-us' : require('pages/Aboutus.vue').default,
      'privacy-policy' : require('pages/privacypl.vue').default,
   },
  data () {
    return {
      leftDrawerOpen: false,
      selectedmenu: null,
      showaboutus: false,
      showcontactus: false,
      showprivacy:false,
      imagesrc:'/assets/logo.jpeg',
      testcntr:0,
      MenuList:
            [
        {
          name: 'User',
          icon: 'mdi-account',
          active: false,
          link: '/#/cities'
        },
        {
          name: 'Engineer',
          icon: 'mdi-account-hard-hat',
          active: false,
          link: '/#/category'
        },
        {
          name: 'Dealer',
          icon: 'group_work',
          active: false,
          link: '/#/newengineers'
        }]
    }
  },
  computed:{
    showSelectedPerson(){
        try {
          if (this.$store.state.usertype == 'User' || this.$store.state.usertype == 'Dealer')
            return this.$store.state.usertype + ': ' + this.$store.state.selectedUser.name
          else 
            return `${this.$store.state.usertype}: ${this.$store.state.selectedProvider.name}`
        }catch(e){
            return ''
        }
    },
    showloginStatus(){
      if(this.$store.state.login)
        return "Logout"
      else
        return "Login"
    },
    showloginIcon(){
      if (this.$store.state.login)
        return 'logout'
      else
        return 'login'
    }

  },
  methods:{
    onMenuClick(item){
        if (this.selectedmenu)
          this.selectedmenu.active =false
        item.active=true
        this.selectedmenu = item
        this.$store.commit('setLoginType',item.name)
        console.log(this.$router.name)
        console.log('Selected User: ' + JSON.stringify(this.$store.state.selectedUser))
        console.log('Selected Eng: ' + JSON.stringify(this.$store.state.selectedProvider))
        const path = `/Pageauth`
        if (this.$route.path !== path) this.$router.push(path)
    },
        onLogin(){
      this.$router.push('/Pageauth')
    },
    onSearch(){
      this.$router.push('/search')
    },
    onServices(){
      if (this.$store.state.selectedProvider)
        this.$router.push('/providerservices')
      else
        this,$router.push('/Pageauth')
    },
    onChangeType() {
      if (this.$store.state.usertype === 'User')
        this.$store.commit('setLoginType','Provider')
      else
        this.$store.commit('setLoginType','User')
    },
    onLogoClick(){
      this.testcntr++
      if (this.testcntr > 5) {
        this.$store.commit('setTestMode',!this.$store.state.testMode)
        if (this.$store.state.testMode)
          this.imagesrc = '/assets/logo_test.jpg'
        else
          this.imagesrc = '/assets/logo.jpeg'
        this.testcntr = 0
      }
    }
  },
  mounted() {
      this.$store.commit('setLoginType','User')
      this.$router.push('/search')
      this.$store.commit('setSelectedTab','Search') 
      //console.log(this.testapi(8754694995))
      this.$q.notify.setDefaults({
        position: 'top',
        timeout: 5000,
        textColor: 'white',
        icon: 'announcement',
        progress: true,
        actions: [{ icon: 'close', color: 'white' }]
      })
  },
  updated() {
    // this.$router.push('/search')
    // this.$store.commit('setSelectedTab','Search')
  }
}
</script>

<style lang="sass" scoped>
.menu-list .q-item
  border-radius: 0 32px 32px 0
</style>