import Vuex from 'vuex'
import firebase, {auth, GoogleProvider, storage, mapJson} from '@/services/fireinit.js'

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: null,
      maps: {}
    },
    getters: {
      activeUser: (state, getters) => {
        return state.user
      },
      maps: (state, getters) => {
        return state.maps
      },
      uid: (state) => {
        if (state.user) {
          return state.user.uid
        }
      }
    },
    mutations: {
      setUser (state, payload) {
        state.user = payload
      },
      load_maps (state, data) {
        state.maps = {}
        for (let key in data) {
          state.maps[key] = data[key]
          data[key].key = key
        }
      }
    },
    actions: {
      autoSignIn ({commit}, payload) {
        commit('setUser', payload)
      },

      signInWithGoogle ({commit}) {
        return new Promise((resolve, reject) => {
          auth.signInWithRedirect(GoogleProvider)
          resolve()
        })
      },
      signInWithEmail ({commit}, {email, password}) {
        return new Promise((resolve, reject) => {
          auth.signInWithEmailAndPassword(email, password)
          resolve()
        })
      },
      signUpWithEmail ({commit}, {email, password}) {
        return new Promise((resolve, reject) => {
          auth.createUserWithEmailAndPassword(email, password)
          resolve()
        })
      },
      signOut ({commit}) {
        auth.signOut().then(() => {
          commit('setUser', null)
        }).catch(err => console.log(err))
      },
      imageToStorage ({state}, {file, fileName}) {
        const url = 'images/' + state.user.uid + '/' + fileName
        const fileRef = storage.ref().child(url)
        return fileRef.put(file).then(resp => {
          console.log('Upload image OK')
          return resp.downloadURL
        }).catch(err => {
          return err
        })
      },
      uploadMapToDB ({state}, {json, mapName, style, btn, center, icon}) {
        return mapJson.child(state.user.uid).push({
          map_name: mapName,
          map_style: style,
          map_center: center,
          map_json: json,
          btn_cfg: btn,
          icon: icon
        }).then(resp => {
          console.log('MAP uploaded', resp)
        })
      },
      updateMapToDB ({state}, {key, json, mapName, style, btn, center, icon}) {
        return mapJson.child(state.user.uid + '/' + key).update({
          map_name: mapName,
          map_style: style,
          map_center: center,
          map_json: json,
          btn_cfg: btn,
          icon: icon
        }).then(resp => {
          console.log('Map updated', resp)
        })
      },
      downloadsMapListFromDB ({state, commit}) {
        return mapJson.child(state.user.uid).once('value').then(resp => {
          console.log('Downloads maps :', resp.val())
          commit('load_maps', resp.val())
        }).catch(err => {
          console.log('Downloads maps ERROR:', err)
        })
      }
    }
  })
}

export default createStore
