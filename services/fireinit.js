// This is `services/fireinit.js`

import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/storage'

const config = {
  apiKey: "AIzaSyAI91VWd3idwRNBzMOkBSZWUsiG6GVuo3Y",
  authDomain: "maplabel20171228.firebaseapp.com",
  databaseURL: "https://maplabel20171228.firebaseio.com",
  projectId: "maplabel20171228",
  storageBucket: "maplabel20171228.appspot.com",
  messagingSenderId: "386993727574"
}

!firebase.apps.length ? firebase.initializeApp(config) : ''
export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const DB = firebase.database()
export const mapJson = firebase.database().ref().child('mapjson')
export const storage = firebase.storage()
export default firebase
