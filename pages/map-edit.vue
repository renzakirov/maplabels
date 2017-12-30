<template>
  <div class="container">
    <div class="columns">
      <div class="column col-12">
        <h1 class="float-left">ПРИВЕТ</h1>
        <button class="btn float-right" @click="logout">Log out</button>
      </div>
      <div class="column col-12" :style="{'margin-bottom': '1.5rem'}">
        <div class="dropdown float-left" :class="{active: showMapsList}">
          <button class="btn" @click="showMapsList = !showMapsList">Загрузить карту</button>
          <ul class="menu" :class="{active: showMapsList}" v-show="showMapsList">
            <li class="menu-item" v-if="maps" v-for="map in maps" :key="map.map_name" @click="selectMapItem(map)">
              {{map.map_name}}
            </li>
          </ul>
        </div>
        <label class="form-label float-left">или</label>
        <button class="btn float-left mx-2" @click="newMap">Новая карта (очистить карту)</button>
        <label class="form-label float-left">Название карты:</label>
        <input class="form-input float-left" type="text" v-model="mapName" :style="{width: '20rem', margin: '0 1rem'}">
      </div>
      <div class="column col-6">
        <div id="map" :style="{height: '100%', width: '90%', margin: 'auto'}"></div>
      </div>
      <div class="column col-6">
        <button class="btn" @click="addObject">Add object</button>
        <button class="btn" @click="deleteObject" :disabled="(!this.myMap || !this.selectedObject || !this.selectedObject.placemark)">Delete object</button>
        <fieldset :disabled="!showForm">
          <div class="form-group">
            <label class="form-label">Координаты:</label>
            <div class="columns">
              <div class="column col-4">
                <input class="form-input" type="text" v-model="selectedObject.coord[0]">
              </div>
              <div class="column col-4">
                <input class="form-input" type="text" v-model="selectedObject.coord[1]">
              </div>
            </div>
            <label class="form-label">Подпись к иконке:</label>
            <input class="form-input" type="text" v-model="selectedObject.iconContent">
            <label class="form-label">Хинт иконки</label>
            <input class="form-input" type="text" v-model="selectedObject.hintContent">
            <label class="form-label">Заголовок окна</label>
            <input class="form-input" type="text" v-model="selectedObject.balloonContentHeader">

            <label class="form-label">Загрузить картинку:</label>
            <input class="form-input" type="file" name="fileUpload" @change="onFileChange">

            <baloon-body :syncHtml.sync="selectedObject.balloonContentBody"/>

            <label class="form-label">Футер окна</label>
            <input class="form-input" type="text" v-model="selectedObject.balloonContentFooter">
            <button class="btn mt-2" @click="SaveObject(false)">Сохранить</button>
            <button class="btn mt-2" @click="SaveObject(true)">Сохранить и скопировать</button>
            <button class="btn mt-2" @click="CancelObject">Отмена</button>
          </div>
        </fieldset>
          <button class="btn" @click="saveMap">Сохранить карту</button>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import selectelConnector from '../components/selectel-connector'
import BaloonBody from '../components/baloon-body'

export default {
  components: {
    'selectel-connector': selectelConnector,
    'baloon-body': BaloonBody
  },
  data () {
    return {
      showMapsList: false,
      myMap: {},
      mapInJson: {},
      mapObjects: [],
      selectedObject: {
        coord: [47, 40],
        iconContent: '',
        hintContent: '',
        balloonContentHeader: '',
        balloonContentBody: '',
        balloonContentFooter: '',
        placemark: undefined
      },
      showForm: false,
      mapName: 'Новая карта',
      selectedMap: undefined
    }
  },
  // head () {
  //   return {
  //     script: [{ src: 'http://api-maps.yandex.ru/2.1/?lang=ru_RU' }]
  //   }
  // },
  beforeMount () {
    const yandexMapScript = document.createElement('SCRIPT')
    yandexMapScript.setAttribute('src', 'https://api-maps.yandex.ru/2.1/?lang=ru_RU')
    yandexMapScript.setAttribute('async', '')
    yandexMapScript.setAttribute('defer', '')
    document.body.appendChild(yandexMapScript)
    yandexMapScript.onload = () => {
      window.ymaps.ready(() => {
        this.item_map_init()
      })
    }
  },
  mounted () {
    this.$store.dispatch('downloadsMapListFromDB')
  },
  methods: {
    newMap () {
      this.showMapsList = false
      this.selectedMap = undefined
      this.mapName = 'Новая карта'
      this.CancelObject ()
      if (this.myMap && this.myMap.geoObjects && this.myMap.geoObjects.getLength()) this.myMap.geoObjects.removeAll()
    },
    selectMapItem(map) {
      this.showMapsList = false
      this.selectedMap = map
      this.mapName = map.map_name
      this.buildMapFromJson(map.map_json)
    },
    saveToDB () {
      this.$store.dispatch('saveToDB', this.fileName)
    },
    logout () {
      this.$store.dispatch('signOut').then(() => {
        alert('logged out!')
        this.$router.push('/')
      })
    },
    item_map_init () {
      this.myMap = new window.ymaps.Map('map', {
        center: [47.222543, 39.718732],
        zoom: 8
      })
    },
    addObject (copy) {
      if (!this.myMap) return
      if (!copy) this.CancelObject()
      const coord = this.myMap.getCenter()
      this.selectedObject.coord = coord.slice()
      let placemark = new window.ymaps.Placemark(coord, {
        iconContent: this.selectedObject.iconContent,
        hintContent: this.selectedObject.hintContent,
        balloonContentHeader: this.selectedObject.balloonContentHeader,
        balloonContentBody: this.selectedObject.balloonContentBody,
        balloonContentFooter: this.selectedObject.balloonContentFooter
      }, {
        preset: 'islands#redStarCircleIcon',
        iconColor: '#ff0000',
        draggable: true,
        visible: true
      })
      placemark.events.add('click', this.clickOnObject)
      placemark.events.add('drag', this.dragObject)
      this.myMap.geoObjects.add(placemark)
      this.selectedObject.placemark = placemark
      this.showForm = true
      // console.log(placemark)
    },
    deleteObject () {
      console.log('deleteObject')
      if (!this.myMap || !this.selectedObject || !this.selectedObject.placemark) return
      this.myMap.geoObjects.remove(this.selectedObject.placemark)
      this.CancelObject()
    },
    clickOnObject (e) {
      this.CancelObject()
      const target = e.get('target')
      target.options.set({
        preset: 'islands#redStarCircleIcon',
        draggable: true
      })
      const coord = e.get('coords')
      const prop = target.properties.getAll()
      this.selectedObject = {
        coord: coord,
        iconContent: prop.iconContent,
        hintContent: prop.hintContent,
        balloonContentHeader: prop.balloonContentHeader,
        balloonContentBody: prop.balloonContentBody,
        balloonContentFooter: prop.balloonContentFooter,
        placemark: target
      }
      this.showForm = true
    },
    dragObject (e) {
      if (this.selectedObject && this.selectedObject.placemark && this.selectedObject.placemark.geometry) {
        const coord = this.selectedObject.placemark.geometry.getCoordinates()
        this.selectedObject.coord = coord.slice()
      }
    },
    SaveObject (copy) {
      this.selectedObject.placemark.properties.set({
        iconContent: this.selectedObject.iconContent,
        hintContent: this.selectedObject.hintContent,
        balloonContentHeader: this.selectedObject.balloonContentHeader,
        balloonContentBody: this.selectedObject.balloonContentBody,
        balloonContentFooter: this.selectedObject.balloonContentFooter
      })
      if (copy) {
        if (this.selectedObject.placemark) {
          this.selectedObject.placemark.options.set({
            preset: 'islands#redCircleDotIcon',
            draggable: true
          })
        }
        this.addObject(copy)
      } else {
        this.CancelObject()
      }
    },
    CancelObject () {
      if (this.selectedObject.placemark) {
        this.selectedObject.placemark.options.set({
          preset: 'islands#redCircleDotIcon',
          draggable: true
        })
      }
      this.showForm = false
      this.selectedObject = {
        coord: ['', ''],
        iconContent: '',
        hintContent: '',
        balloonContentHeader: '',
        balloonContentBody: '',
        balloonContentFooter: '',
        placemark: undefined
      }
    },
    // ****************** image & file ************
    onFileChange (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      const file = files[0]
      const fileName = file.name
      this.$store.dispatch('imageToStorage', {file: file, fileName: fileName}).then(url => {
        console.log('load IMAGE url = ', url)
        this.selectedObject.balloonContentBody += ('<br><img src="' + url + '" width="300"><br>')
      })
    },
    saveMap () {
      let mapObjects = []
      this.myMap.geoObjects.each((obj) => {
        const coord = obj.geometry.getCoordinates()
        const prop = obj.properties.getAll()
        if (prop && coord) {
          let mapObj = {
            coord: coord,
            iconContent: prop.iconContent,
            hintContent: prop.hintContent,
            balloonContentHeader: prop.balloonContentHeader,
            balloonContentBody: prop.balloonContentBody,
            balloonContentFooter: prop.balloonContentFooter
          }
          mapObjects.push(mapObj)
        }
      })
      if (this.selectedMap) {
        this.$store.dispatch('updateMapToDB', {
          key: this.selectedMap.key,
          mapName: this.mapName,
          json: mapObjects
        }).then(resp => {
          console.log('Map uploaded to DB')
        }).catch(err => {
          console.log('Error in map uloading process')
        })
      } else {
        this.$store.dispatch('uploadMapToDB', {
          mapName: this.mapName,
          json: mapObjects
        }).then(resp => {
          console.log('Map uploaded to DB')
        }).catch(err => {
          console.log('Error in map uloading process')
        })
      }
    },
    buildMapFromJson (jsonMap) {
      if (!jsonMap || !this.myMap) return
      jsonMap.forEach(el => {
        console.log('jsonMap.el = ', el)
        let placemark = new window.ymaps.Placemark(el.coord, {
          iconContent: el.iconContent,
          hintContent: el.hintContent,
          balloonContentHeader: el.balloonContentHeader,
          balloonContentBody: el.balloonContentBody,
          balloonContentFooter: el.balloonContentFooter
        }, {
          preset: 'islands#redCircleDotIcon',
          iconColor: '#ff0000',
          draggable: true,
          visible: true
        })
        placemark.events.add('click', this.clickOnObject)
        placemark.events.add('drag', this.dragObject)
        this.myMap.geoObjects.add(placemark)
      })
    },
    downloadsMapList () {
      this.$store.dispatch('downloadsMapListFromDB')
    }
  },
    computed: {
      ...mapGetters(['maps'])
    }
}
</script>

<style lang='scss' scoped>
#map {
  height: 100%;
}
  .quill-container {
    width: 100%;
    margin: 0 auto;
    padding: 20px 0;
    .quill-editor {
      min-height: 200px;
      max-height: 400px;
      overflow-y: auto;
    }
    .form-input {
      margin-bottom: 1rem;
    }
  }
  .btn {
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .dropdown {
    .menu {
      .menu-item {
        &:hover {
          background-color: #5755d9;
          color: #fff;
        }
      }
    }
  }

</style>
