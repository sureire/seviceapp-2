import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// import example from './module-example'
Vue.prototype.$http = axios

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    usertype: process.env.USERTYPE,
    login: false,
    Locations : [],//['Coimbatore', 'Pollachi', 'udumalai','Ooty'],
    Services : [], //['Home Cleaning', 'Electrical', 'Appliances', 'Plumbing'],
    selectedlocation:'',
    selectedservice:'',
    selectedProvider:null,
    selectedUser: null,
    selectedTab: '',
    Providers: [], 
    BookingList: [],
    Settings:[],
    service_amt: null,
    testMode:false    
  },
  mutations: {
    addTask(state, newTaskTitle) {
      let newTask = {
        id: Date.now(),
        title: newTaskTitle,
        done: false
      }
      state.tasks.push(newTask)
    },
    doneTask(state, id) {
      let task = state.tasks.filter(task => task.id === id)[0]
      task.done = !task.done
    },
    deleteTask(state, id) {
      state.tasks = state.tasks.filter(task => task.id !== id)
    },
    setLoginType(state,type){
      state.usertype = type
    },
    setSelectedLocation(state,location) {
        state.selectedlocation = location
    },
    setSelectedService(state,service){
      state.selectedservice = service
    },
    setSelectedProvider(state, provider){
      state.selectedProvider = provider
    },
    setSelectedUser(state, user){
      state.selectedUser = user
    },
    SET_CITIES(state, dblocations) {
      state.Locations = []
      dblocations.forEach(e => state.Locations.push(e.name))
      //console.log(state.Locations)
      //state.Locations = dblocations
    },
    SET_CATEGORIES(state, dbcategories) {
      state.Services = []
      dbcategories.forEach(e => state.Services.push(e.name))
    },
    SET_BOOKINGLIST(state, bookinglist){
      state.BookingList = []
      bookinglist.forEach(e => {
        //console.log(e)
        state.BookingList.push(e)
      });
    },
    setSelectedTab(state, tab) {
      state.selectedTab = tab
    },
    setLoginStatus(state, status){
      state.login = status
    },
    setSettings(state, setting){
      state.Settings = setting
      let a = setting.filter(a => a.key1 === 'service_amount ₹')
      state.service_amt = a[0].value
      //console.log('state.service_amt: ' + state.service_amt)
    },
    setTestMode(state, mode){
      state.testMode = mode
    }


  },
  actions: {
    getLocations({commit}) {
      //console.log(process.env.HOSTNAME + '/cities')
      axios.get(process.env.HOSTNAME + '/cities')
        .then(response => {
          //console.log(response.data)
          commit('SET_CITIES', response.data)
        }).catch (err => {
          throw err
        })
    },
    getCategory({commit}) {

      axios.get(process.env.HOSTNAME + '/categories')
        .then(response => response.data)
        .then(data => {
          commit('SET_CATEGORIES', data)
        })
        .catch(err => {
          throw err
        })
    },
    async getSettings({commit}) {
      try {
        let res = await axios.get(process.env.HOSTNAME + '/settings')
        commit('setSettings',res.data)
      }catch(err){
        console.error(err)
      }
    },
    getBookingList({commit},id) {
      axios.get(`${process.env.HOSTNAME}/srequest_bookinglist/${id}`)
      .then(response => {
          commit('SET_BOOKINGLIST', response.data[0])
      })
      .catch(err => {
          throw(err)
      })
    }

  },
  getters: {

  }
})
