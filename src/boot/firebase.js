import firebase from "firebase"

const firebaseConfig = {
  apiKey: "AIzaSyC9s6--EnmhV3WZ0aXq5DQWV1P6dywyFfs",
  authDomain: "vplusu-4b649.firebaseapp.com",
  projectId: "vplusu-4b649",
  storageBucket: "vplusu-4b649.appspot.com",
  messagingSenderId: "520738163154",
  appId: "1:520738163154:web:67fc04bc6f778c88eba00b"
}

firebase.initializeApp(firebaseConfig)

let fsstorage = firebase.storage()
export { fsstorage}