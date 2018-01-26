import Vuex from 'vuex'
import firebase, {auth, GoogleProvider, storage, mapJson} from '@/services/fireinit.js'

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: null,
      maps: {},
      help: {
        'КАРТА': 'Настройка параметров, относящихся ко всей карте',
        'ОБЪЕКТЫ': 'Добавление объектов на карту',
        'Новая карта': 'Очистит текущие данные и создаст новую пустую карту',
        'Загрузить карту': 'Загрузить карту из ранее сохраненных',
        'Сохранить карту': 'Сохранить данные карты в базу с заданым именем',
        'Сохранить как': '',
        'Добавить из': 'Загрузит данные из другой вашей карты в текущую',
        'Удалить карту': 'Удаляет карту из выпадающего спика ваших карт',
        'Название карты': 'Под этим названием карта будет сохранена в базе',
        'Центр карты': 'Текущий центр карты. Введите координаты и нажмите кнопку ПЕРЕМЕСТИТЬ',
        'Масштаб': 'Масштаб',
        'Ширина': 'Ширина виджета карты при вставке в сайт - px, vh, rem, em',
        'Высота': 'Выстоа виджета карты при вставке в сайт - px, vh, rem, em',
        'Значок иконки': 'Иконка объекта на карте. Один тип иконки для всех объектов карты.',
        'Цвет иконки': 'Цвет иконки объекта на карте. Один цвет иконки для всех объектов карты.',
        'Отредактировать кнопку': 'Редактор стиля кнопки. Кнопка встраивается в объект на карте.',
        'Получить код': 'генерирует код для вставки виджета карты (карта должна быть сохранена)',
        'Добавить': 'Добавляет объект на карту',
        'Удалить': 'Удаляет объект с карты',
        'Координаты': 'Координаты объекта. Меняются перетаскиванием или введите координаты и нажмите кнопку ПЕРЕМЕСТИТЬ',
        'Подпись к иконке': '',
        'Хинт иконки': '',
        'Заголовок окна': '',
        'Загрузить картинку': 'Загрузить картинку для объекта в хранилище',
        'Редактор': '',
        'Кнопка': 'Добавить кнопку для объекта',
        'Кнопка ссылка': 'Ссылка кнопки для этого объекта',
        'Кнопка надпись': 'Надпись на кнопке для этого объекта',
        'Футер окна': '',
        'Сохранить объект': 'Сохранить данные для объекта и очистить поля формы',
        'Сохранить и создать объект': 'Сохранить данные для объекта и скопировать в новый объект',
        'Очистить': 'Очистить поля формы',
        '': ''
      }
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
      },
      help: (state) => state.help
    },
    mutations: {
      setUser (state, payload) {
        console.log('mutations setUser', payload)
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
        console.log('!!!!!!!!!!!!!!! auto sign in ')
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
      uploadMapToDB ({state}, mapName) {
        return mapJson.child(state.user.uid).push({
          map_name: mapName || 'Новая карта'
        }).then(resp => {
          return resp
        })
      },
      updateMapToDB ({state}, {key, json, mapName, style, btn, center, zoom, icon}) {
        return mapJson.child(state.user.uid + '/' + key).update({
          map_name: mapName,
          map_style: style,
          map_center: center,
          zoom: zoom,
          map_json: json,
          btn_cfg: btn,
          icon: icon
        }).then(resp => {
          return resp
        })
      },
      deleteMapFromDB ({state}, key) {
        console.log('=== in deleteMapFromDB')
        return mapJson.child(state.user.uid + '/' + key).remove().then(resp => {
          console.log('Map Deleted')
          return resp
        })
      },
      downloadsMapListFromDB ({state, commit}) {
        return mapJson.child(state.user.uid).once('value').then(resp => {
          console.log('Downloads maps :', resp.val())
          commit('load_maps', resp.val())
        }).catch(err => {
          console.log('Downloads maps ERROR:', err)
          return err
        })
      }
    }
  })
}

export default createStore
