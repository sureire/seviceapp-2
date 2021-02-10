import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// import example from './module-example'
Vue.prototype.$http = axios

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    usertype: process.env.USERTYPE,
    Locations : [],//['Coimbatore', 'Pollachi', 'udumalai','Ooty'],
    Services : [], //['Home Cleaning', 'Electrical', 'Appliances', 'Plumbing'],
    selectedlocation:'',
    selectedservice:'',
    selectedProvider:'',
    selectedUser: '',
    selectedTab: '',
    Providers: [], 
    BookingList: []
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
      console.log(state.Locations)
      //state.Locations = dblocations
    },
    SET_CATEGORIES(state, dbcategories) {
      state.Services = []
      dbcategories.forEach(e => state.Services.push(e.name))
    },
    SET_BOOKINGLIST(state, bookinglist){
      state.BookingList = []
      bookinglist.forEach(e => {
        console.log(e)
        state.BookingList.push(e)
      });
    },
    setSelectedTab(state, tab) {
      state.selectedTab = tab
    }


  },
  actions: {
    getLocations({commit}) {
      console.log(process.env.HOSTNAME + '/cities')
      axios.get(process.env.HOSTNAME + '/cities')
        .then(response => {
          console.log(response.data)
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
