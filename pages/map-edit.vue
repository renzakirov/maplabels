<template>
  <div class="container map-edit-container">
    <button class="btn btn-sm log-out-btn" @click="logout">Log out</button>
    <modal-button-setting ref="btnCfgWin"
      :show="showModalButtonSetting"
      @close="showModalButtonSetting=false" @save="saveBtnConfig"/>

    <modal-code ref="modalCodeRef" :show="showModalCode" @close="showModalCode=false" />

    <div class="columns">
      <div class="column col-6 text-section">
        <h1>ПРИВЕТ</h1>
      </div>
      <div class="column col-6 tabs-section">
        <ul class="tab tab-block">
          <li class="tab-item" :class="{active: showMapBox}" @click="showMapBox=true, showObjectsBox=false">
            <a href="javascript:void(0)" >КАРТА</a>
          </li>
          <li class="tab-item" :class="{active: showObjectsBox}" @click="showMapBox=false, showObjectsBox=true">
            <a href="javascript:void(0)">ОБЪЕКТЫ</a>
          </li>
        </ul>
      </div>
      <div class="column col-6">
        <div id="map" :style="{height: '90vh', width: '100%', margin: 'auto', 'background-color':'lightgrey'}"></div>
      </div>
      <div class="column col-6 config-box-container">

        <div class="map-config-box" :class="{disabled: !showMapBox}">
          <div class="divider"></div>
          <div class="column">
            <button class="btn mx-2" @click="newMap">Новая карта</button>
            <div class="dropdown" :class="{active: showMapsList}" v-if="maps" >
              <button class="btn mx-2" @click="showMapsList = !showMapsList">Загрузить карту</button>
              <ul class="menu" :class="{active: showMapsList}" v-show="showMapsList">
                <li class="menu-item" v-for="map in maps" :key="map.key" @click="selectMapItem(map)">
                  {{map.map_name}}
                </li>
              </ul>
            </div>
            <button class="btn mx-2" @click="saveMap">Сохранить карту</button>
            <div class="dropdown" :class="{active: showMapsDel}" v-if="maps">
              <button class="btn btn-error mx-2" @click="showMapsDel = !showMapsDel">Удалить карту</button>
              <ul class="menu" :class="{active: showMapsDel}" v-show="showMapsDel">
                <li class="menu-item" v-for="map in maps" :key="map.key" @click="deleteMap(map)">
                  {{map.map_name}}
                </li>
              </ul>
            </div>
          </div>
          <div class="column d-flex mt-2">
            <label class="form-label" :style="{width: '11rem'}">Название карты:</label>
            <input class="form-input" type="text" v-model="mapName">
            <span class="questionmark tooltip tooltip-left" :data-tooltip="help['Название карты']"><img src="/info.png" width="20" height="20"></span>
          </div>
          <div class="divider"></div>
          <div class="column d-flex mt-2">
            <label class="form-label">Центр карты:</label>
            <input class="form-input" type="text" v-model="mapCenter">
            <button class="btn" @click="moveMapCenter">Переместить</button>
            <span class="questionmark tooltip tooltip-left" :data-tooltip="help['Центр карты']"><img src="/info.png" width="20" height="20"></span>
          </div>
          <div class="column d-flex mt-2">
            <label class="form-label">Масштаб:</label>
            <input class="form-input" :style="{width: '5rem'}" type="number" v-model="zoom">
            <button class="btn" @click="changeZoom">Изменить</button>
            <label class="form-label tooltip" :data-tooltip="help['Ширина']" style="margin-left: 2rem; min-width: 5rem;">Ширина:</label>
            <input class="form-input" type="text" v-model="mapWidth">
            <label class="form-label tooltip" :data-tooltip="help['Высота']" style="margin-left: 2rem; min-width: 5rem;">Высота:</label>
            <input class="form-input" type="text" v-model="mapHeight">
          </div>
          <div class="divider"></div>
          <div class="column d-flex mt-2 icon-select-column">
            <label class="form-label">Значок иконки:</label>
            <div class="icon-img"
              v-for="(f, i) in iconImgFiles" :key="i"
              :class="{selected: i === selectedIcon}"
              @click="selectedIcon = i">
              <img :src="'/' + f" alt="icon">
            </div>
            <span class="questionmark tooltip tooltip-left" :data-tooltip="help['Значок иконки']" style="margin-left: auto;margin-right:0;"><img src="/info.png" width="20" height="20"></span>
          </div>
          <div class="column d-flex mt-2">
            <label class="form-label">Цвет иконки:</label>
            <table class="icon-color-table" border>
              <tbody>
                <tr>
                  <td v-for="i in 8" :key="iconTableColors[i]"
                  :style="{'background-color': iconTableColors[i]}"
                  :class="{selected: i === selectedIconTableColor && selectedIcon !== -1}"
                  @click="selectedIconTableColor = i"></td>
                </tr>
                <tr>
                  <td v-for="i in 8" :key="iconTableColors[i+8]"
                  :style="{'background-color': iconTableColors[i+8]}"
                  :class="{selected: i+8 === selectedIconTableColor && selectedIcon !== -1}"
                  @click="selectedIconTableColor = i+8"></td>
                </tr>
              </tbody>
            </table>
            <span class="questionmark tooltip tooltip-left" :data-tooltip="help['Цвет иконки']" style="margin-left: auto;margin-right:0;"><img src="/info.png" width="20" height="20"></span>
          </div>
          <!--div class="column d-flex load-img-container">
            <label class="form-label" :style="{width: 'auto'}">Или загрузите свое изображение для иконки:</label>
            <input class="form-input" type="file" name="iconUpload" @change="onIconFileChange"  :style="{width: 'auto', 'margin-left':'1rem', 'margin-right':'1rem'}">
            <div class="loading-img-box"
              v-show="loadingImg"
              :class="{selected: selectedIcon === -1}"
              @click="selectedIcon = -1" >
              <img :src="loadingImg" alt="icon">
            </div>
          </div-->
          <div class="divider"></div>

          <div class="column d-flex mt-2 map-btn-form-container">
            <label class="form-label">Отредактируйте кнопку:</label>
            <a class="button-in-balloon" @click="showModalButtonSetting=true">Редактировать</a>
            <span class="questionmark tooltip tooltip-left" :data-tooltip="help['Отредактировать кнопку']" style="margin-left: auto;margin-right:0;"><img src="/info.png" width="20" height="20"></span>
          </div>
          <div class="divider"></div>
          <div class="column d-flex mt-2" style="justify-content: center;">
            <button class="btn btn-lg btn-success" @click="getCode">Получить код</button>
            <span class="questionmark tooltip tooltip-left" :data-tooltip="help['Получить код']" style="margin-left: auto;margin-right:0;"><img src="/info.png" width="20" height="20"></span>
          </div>
        </div>

        <div class="objects-config-box" :class="{active: showObjectsBox}">
          <div class="column d-flex mt-2">
            <button class="btn" @click="addObject(true)">Добавить объект</button>
            <button class="btn" @click="deleteObject" :disabled="(!this.myMap || !this.selectedObject || !this.selectedObject.placemark)">Удалить объект</button>
          </div>
          <div class="column d-flex mt-2">
            <label class="form-label">Координаты:</label>
            <input class="form-input" type="text" v-model="selectedObject.coord">
            <button class="btn" style="margin-right:0;margin-bottom:0;" @click="moveCoordinate">Переместить</button>
          </div>
          <div class="column d-flex mt-2">
            <label class="form-label">Подпись к иконке:</label>
            <input class="form-input" type="text" v-model="selectedObject.iconContent">
          </div>
          <div class="column d-flex mt-2">
            <label class="form-label">Хинт иконки:</label>
            <input class="form-input" type="text" v-model="selectedObject.hintContent">
          </div>
          <div class="column d-flex mt-2">
            <label class="form-label">Заголовок окна:</label>
            <input class="form-input" type="text" v-model="selectedObject.balloonContentHeader">
          </div>
          <div class="column d-flex mt-2">
            <label class="form-label">Загрузить картинку:</label>
            <input class="form-input" type="file" name="fileUpload" :value="imageFile" @change="onFileChange">
          </div>

          <div class="column mt-2 tiny-mce-container">
            <tinymce id="d1" :toolbar1="toolbar1" :other_options="other_options" v-model="selectedObject.balloonContentBody"></tinymce>
          </div>
          <div class="column d-flex mt-2 add-balloon-btn-container">
            <label class="form-label" style="min-width: 4rem;">Кнопка:</label>
            <a class="button-in-balloon" @click="addButtonInEditor">Добавить</a>
            <input class="form-input" type="text" v-model="btnConfig.btnHref" placeholder="Ссылка">
            <input class="form-input" type="text" v-model="btnConfig.btnCaption" placeholder="Надпись">
          </div>
          <div class="column d-flex mt-2">
            <label class="form-label">Футер окна:</label>
            <input class="form-input" type="text" v-model="selectedObject.balloonContentFooter">
          </div>
          <div class="column d-flex mt-2">
            <button class="btn mt-2" @click="SaveObject(false)">Сохранить</button>
            <button class="btn mt-2" @click="SaveObject(true)">Сохранить и создать</button>
            <button class="btn mt-2" @click="CancelObject">Очистить</button>
          </div>
        </div>

      </div>
    </div>
    <toast-messages v-for="msg in messages" :key="msg.text" :msg="msg" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tinymce from 'vue-tinymce-editor'
import * as R from 'ramda'
import modalButtonSetting from '../components/modal-button-setting'
import modalCode from '../components/modal-code'
import toastMessages from '../components/toast-messages'

export default {
  components: {
    'tinymce': tinymce,
    'modal-button-setting': modalButtonSetting,
    'modal-code': modalCode,
    'toast-messages': toastMessages
  },
  data () {
    return {
      toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | fontsizeselect | removeformat',
      other_options: {height: 200},
      imageFile: undefined,
      mapCenter: [47.21331185785009,39.72178182031252],
      showMapBox: true,
      showObjectsBox: false,
      zoom: 8,
      mapWidth: '100%',
      mapHeight: '60vh',
      iconImgFiles: [
        'redIcon.png',
        'redDotIcon.png',
        'redCircleIcon.png',
        'redCircleDotIcon.png',
        'redStretchyIcon.png'
      ],
      iconName: [
        'Icon',
        'DotIcon',
        'CircleIcon',
        'CircleDotIcon',
        'StretchyIcon'
      ],
      selectedIcon: 0,
      iconTableColors: [
        '0',
        '#1E98FF',
        '#ED4543',
        '#E6761B',
        '#0E4779',
        '#177BC9',
        '#F371D1',
        '#B3B3B3',
        '#793D0E',
        '#1BAD03',
        '#B51EFF',
        '#595959',
        '#FFD21E',
        '#56DB40',
        '#FF931E',
        '#82CDFF',
        '#97A100'
      ],
      iconColor: [
        'blue',
        'red',
        'darkOrange',
        'night',
        'darkBlue',
        'pink',
        'gray',
        'brown',
        'darkGreen',
        'violet',
        'black',
        'yellow',
        'green',
        'orange',
        'lightBlue',
        'olive'
      ],
      selectedIconTableColor: 2,
      loadingImg: '',
      showModalButtonSetting: false,

      showMapsList: false,
      showMapsDel: false,
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
        placemark: null
      },
      showForm: false,
      btnConfig: {
        btnHref: '#',
        btnCaption: 'Подробнее',
        btnStyle: 'background-color: rgb(38, 196, 117); border-width: 1px; border-style: solid; border-color: rgb(25, 77, 51); border-radius: 3px; color: rgb(255, 255, 255); padding: 4px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 14px; font-weight: 500; margin: 4px 12px; cursor: pointer; box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 16px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;',
        data: null
      },
      btnDefaultStyle: 'background-color: rgb(38, 196, 117); border-width: 1px; border-style: solid; border-color: rgb(25, 77, 51); border-radius: 3px; color: rgb(255, 255, 255); padding: 4px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 14px; font-weight: 500; margin: 4px 12px; cursor: pointer; box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 16px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;',
      mapName: 'Новая карта',
      selectedMap: null,
      showModalCode: false,
      messages: [],
      messagesCount: 0
    }
  },
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
    this.applyBtnStyle()
  },
  watch: {
    selectedIcon (newV, oldV) {
      if (newV && newV !== oldV) {
        this.$nextTick(this.changeMapIcons)
      }
    },
    selectedIconTableColor (newV, oldV) {
      if (newV && newV !== oldV) {
        this.$nextTick(this.changeMapIcons)
      }
    }
  },
  methods: {
    applyBtnStyle () {
      const x = document.createElement('STYLE');
      const a = document.createTextNode(`.button-in-balloon, .button-in-balloon:hover { ${this.btnConfig.btnStyle} }`);
      x.appendChild(a);
      document.head.appendChild(x);
    },
    newMap () {
      this.showMapsList = false
      this.selectedMap = null
      this.mapName = 'Новая карта'
      this.CancelObject ()
      this.clearMapObjects()
      this.message({
        header: 'Успешно',
        text: `Новая карта готова к заполнению`,
        type: 'success',
      })
    },
    item_map_init () {
      this.myMap = new window.ymaps.Map('map', {
        center: this.mapCenter,
        zoom: 8
      })
      this.myMap.events.add('boundschange', this.changeMapBounds)
      this.selectedObject.coord = this.mapCenter
    },
    changeMapBounds (event) {
      this.mapCenter = event.get('newCenter')
      this.zoom = event.get('newZoom')
    },
    moveMapCenter () {
      const mapCenter = R.split(',', this.mapCenter)
      if (mapCenter && mapCenter.length == 2 ) {
        this.myMap.setCenter(mapCenter)
      }
    },
    changeZoom () {
      const z = Number(this.zoom);
      if (z>0 && z<20) {
        this.myMap.setZoom(z)
      }
    },
    changeMapIcons () {
      if (this.myMap && this.myMap.geoObjects && this.myMap.geoObjects.getLength()) {
        this.myMap.geoObjects.each((obj) => {
          obj.options.set(this.presetOptions)
        })
      }
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
      }, this.presetOptions)
      placemark.events.add('click', this.clickOnObject)
      placemark.events.add('drag', this.dragObject)
      this.myMap.geoObjects.add(placemark)
      this.selectedObject.placemark = placemark
      this.showForm = true
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
      const coord = e.get('coords')
      const prop = target.properties.getAll()
      const opt = target.options.getAll()
      console.log('opt = ', opt)
      this.selectedObject = {
        coord: coord,
        iconContent: prop.iconContent,
        hintContent: prop.hintContent,
        balloonContentHeader: prop.balloonContentHeader,
        balloonContentBody: prop.balloonContentBody,
        balloonContentFooter: prop.balloonContentFooter,
        iconColor: opt.iconColor,
        preset: opt.preset,
        placemark: target
      }
      target.options.set({
        preset: 'islands#redStarCircleIcon',
        draggable: true
      })
      this.showForm = true
    },
    dragObject (e) {
      if (this.selectedObject && this.selectedObject.placemark && this.selectedObject.placemark.geometry) {
        const coord = this.selectedObject.placemark.geometry.getCoordinates()
        this.selectedObject.coord = coord.slice()
      }
    },
    moveCoordinate () {
      let coord = R.split(',', this.selectedObject.coord)
      if (coord && coord.length == 2 && this.selectedObject && this.selectedObject.placemark && this.selectedObject.placemark.geometry) {
        this.selectedObject.placemark.geometry.setCoordinates(coord)
        coord = this.selectedObject.placemark.geometry.getCoordinates()
        if (coord && coord.slice()) this.selectedObject.coord = coord.slice()
      }
    },
    SaveObject (copy) {
      if (!this.selectedObject.placemark || !this.selectedObject.placemark.properties || !this.selectedObject.placemark.options || !this.selectedObject.placemark.balloon) {
        console.log('Error in SaveObject method')
      }

      this.selectedObject.placemark.properties.set({
        iconContent: this.selectedObject.iconContent,
        hintContent: this.selectedObject.hintContent,
        balloonContentHeader: this.selectedObject.balloonContentHeader,
        balloonContentBody: this.selectedObject.balloonContentBody,
        balloonContentFooter: this.selectedObject.balloonContentFooter
      })
      this.selectedObject.placemark.options.set(this.presetOptions)
      if (copy) {
        this.selectedObject.placemark.balloon.close()
        this.addObject(copy)
      }
      this.selectedObject.placemark.balloon.open()
    },
    CancelObject () {
      if (this.selectedObject.placemark) {
        this.selectedObject.placemark.options.set(this.presetOptions)
        if (this.selectedObject.placemark.balloon) {
          this.selectedObject.placemark.balloon.close()
        }
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
    clearMapObjects () {
      if (this.myMap && this.myMap.geoObjects && this.myMap.geoObjects.getLength()) {
        this.myMap.geoObjects.removeAll()
      }
    },
    // ****************** image & file ************
    selectMapItem(map) {
      this.clearMapObjects()
      this.showMapsList = false
      this.selectedMap = map
      this.buildMapFromJson(map)
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
    onFileChange (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      const file = files[0]
      const fileName = file.name
      this.$store.dispatch('imageToStorage', {file: file, fileName: fileName}).then(url => {
        this.message({
          header: 'Успешно',
          text: `Файл ${fileName} сохранен в базе`,
          type: 'success',
        })
        console.log('load IMAGE url = ', url)
        this.selectedObject.balloonContentBody += ('<img src="' + url + '" width="300">')
        e.target.files = null
        e = null
      })
    },
    // НАЖАЛИ КНОПКУ СОХРАНИТЬ КАРТУ
    saveMap () {
      if (!this.myMap) return
      if (!this.selectedMap || !this.selectedMap.key) {
        this.createMapInDb()
      } else {
        this.updateMapInDb()
      }
    },
    createMapInDb() {
      this.$store.dispatch('uploadMapToDB', this.mapName).then(resp => {
        const key = resp ? resp.key : ''
        return this.$store.dispatch('downloadsMapListFromDB').then(() => {
          if (this.maps[key]) {
            this.selectedMap = this.maps[key]
            this.updateMapInDb()
          }
        })
      }).catch(err => {
        console.log('Error in map uloading process')
      })
    },
    updateMapInDb () {
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

      const style = {
        width: this.mapWidth,
        height: this.mapHeight,
        style: `#map${this.selectedMap.key} {width:${this.mapWidth};height:${this.mapHeight};}`
      }

      //
        this.$store.dispatch('updateMapToDB', {
          key: this.selectedMap.key,
          mapName: this.mapName,
          style: style,
          json: mapObjects,
          btn: this.btnConfig,
          center: this.mapCenter,
          zoom: this.zoom,
          icon: {
            preset: this.presetOptions.preset,
            color: this.iconColor[this.selectedIconTableColor-1],
            name: this.iconName[this.selectedIcon]
          }
        }).then(resp => {
          this.message({
            header: 'Успешно',
            text: `Карта успешно сохранена`,
            type: 'success',
          })
          this.$store.dispatch('downloadsMapListFromDB')
        }).catch(err => {
          console.log('Error in map uloading process')
        })
    },
    deleteMap (map) {
      console.log('******* Delete', map, map.key)
      this.showMapsDel = false
      if (!this.myMap || !map || !map.key) return
      if (this.selectedMap && (this.selectedMap.key == map.key)) {
        this.message({
          header: 'Успешно',
          text: `Карта успешно удалена`,
          type: 'success',
        })
        this.newMap()
      }
      console.log('Delete!!!!', map.key)
      this.$store.dispatch('deleteMapFromDB', map.key).then(resp => {
        this.message({
          header: 'Успешно',
          text: `Карта успешно удалена`,
          type: 'success',
        })
        this.$store.dispatch('downloadsMapListFromDB')
      })
    },
    // создает карту из JSON после выбора из выпадающего списка
    buildMapFromJson (map) {
      console.log('buildMapFromJson -> map = ', map)
      if (!map || !this.myMap) return

      this.mapName = map.map_name || 'Новая карта'
      this.mapCenter = map.map_center || [45,45]
      this.myMap.setCenter(this.mapCenter || [45,45])

      this.myMap.setZoom(map.zoom || 8)

      this.mapWidth = map.style ? map.style.width : '100%'
      this.mapHeight =  map.style ? map.style.height : '60vh'

      const preset = map.icon.preset || 'islands#nightCircleDotIcon'

      if (map.icon && map.icon.color) {
        this.iconColor.forEach((col, i) => {
          if (col == map.icon.color) {
            this.selectedIconTableColor = i + 1
          }
        })
      } else {
        this.selectedIconTableColor = 1
      }

      if (map.icon && map.icon.name) {
        this.iconName.forEach((name, i) => {
          if (name == map.icon.name) {
            this.selectedIcon = i
          }
        })
      } else {
        this.selectedIcon = 1
      }

      if (!map.btn_cfg) {
        map.btn_cfg = {}
      }

      this.btnConfig = map.btn_cfg // { btnCaption, btnHref, btnStyle, data }
      if (!this.btnConfig.btnCaption) this.btnConfig.btnCaption = 'Подробнее'
      if (!this.btnConfig.btnHref) this.btnConfig.btnHref = '#'
      if (!this.btnConfig.btnStyle) this.btnConfig.btnStyle = this.btnDefaultStyle

      this.applyBtnStyle()
      if (this.btnConfig.data) this.$refs.btnCfgWin.updateData(this.btnConfig.data)

      if (!map.map_json || !map.map_json.length) return
      map.map_json.forEach(el => {
        // console.log('jsonMap.el = ', el)
        let placemark = new window.ymaps.Placemark(el.coord, {
          iconContent: el.iconContent,
          hintContent: el.hintContent,
          balloonContentHeader: el.balloonContentHeader,
          balloonContentBody: el.balloonContentBody,
          balloonContentFooter: el.balloonContentFooter
        }, {
          preset: preset,
          draggable: true,
          visible: true
        })
        placemark.events.add('click', this.clickOnObject)
        placemark.events.add('drag', this.dragObject)
        this.myMap.geoObjects.add(placemark)
      })
      this.message({
        header: 'Успешно',
        text: `Карта успешно загружена`,
        type: 'success',
      })
    },
    downloadsMapList () {
      this.$store.dispatch('downloadsMapListFromDB')
    },
    addButtonInEditor() {
      this.selectedObject.balloonContentBody += `<a href="${this.btnConfig.btnHref}" class="button-in-balloon">${this.btnConfig.btnCaption}</a>`
    },
    onIconFileChange() {
      // TODO сделать чтобы менялись все иконки после выбора новой иконки по-умолчанию ???
    },
    saveBtnConfig (cfg) {
      this.btnConfig.btnHref = cfg.href
      this.btnConfig.btnCaption = cfg.caption
      this.btnConfig.btnStyle = cfg.style
      this.btnConfig.data = cfg.data
      this.showModalButtonSetting=false
    },
    // формирует данные для компоненты которая генерирует код для вставки в Тильду
    getCode () {
      if (!this.selectedMap || !this.selectedMap.key) {
        //TODO error msg-s
        console.log('Нужно создать и сохранить или загрузить карту')
        return
      }
      if (!this.uid) {
        //TODO error msg-s
        console.log('uid not finded')
        return
      }
      const baseUrl = `const baseUrl = 'https://maplabel20171228.firebaseio.com/mapjson/${this.uid}/${this.selectedMap.key}.json';`

      this.$refs.modalCodeRef.setCode({
        mapKey: this.selectedMap.key,
        baseUrl: baseUrl
        // style: `<style>#map${this.selectedMap.key} {min-width:200px;min-height:200px;}<` + '/style>'
      })
      this.showModalCode = true
    },
    message(ops) {
      this.messagesCount++
      ops.show = true
      ops.timer = 30000
      ops.count = this.messagesCount
      this.messages.push(ops)
      setTimeout( () => {
        const count = ops.count
        const index = R.findIndex((msg) => msg.count == count, this.messages)
        if (index > -1) {
          this.messages.splice(index, 1)
        }
      },ops.timer)
    }
  },
  computed: {
    ...mapGetters(['maps','uid', 'help']),
    presetOptions () {
      return {
        preset: 'islands#' + this.iconColor[this.selectedIconTableColor-1] + this.iconName[this.selectedIcon], // 'islands#redStarCircleIcon',
        draggable: true,
        visible: true
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import "~spectre.css/src/_variables.scss";
  #map {
    height: 100%;

  }
  .log-out-btn {
    position: fixed;
    top: 0;
    right: -10px;
  }
  .map-edit-container {
    height: 100vh;
    .text-section, .tabs-section {
      height: 3rem;
    }
    .config-box-container {
      position: relative;
      .map-config-box {
        overflow: auto;
        position: absolute;
        top: 0;
        bottom: 0;
        transform: translateX(0);
        width: 100%;
        overflow-x: hidden;
        &.disabled {
          opacity: 0;
        }

        .d-flex {
          align-items: center;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        padding: 1rem;
        .divider {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .form-label {
          min-width: 7rem;
        }

        .questionmark {
          margin-left: .5rem;
        }
        .tooltip.tooltip-left:after {
          bottom: 100%
        }

        .icon-select-column {
          justify-content: flex-start;
          .icon-img {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 3rem;
            width: 3rem;
            &:last-child {
              width: 5rem;
            }
            &:hover {
              border: 1px dotted red;
              border-radius: 3px;
            }
            &.selected {
              border: 2px dotted red;
              border-radius: 3px;
            }
          }
        }

        .icon-color-table {
          td {
            width: 50px;
            height: 20px;
            &.selected {
              transform: scale(1.3);
            }
          }
        }

        .load-img-container {
          margin-top: 1rem;
          position: relative;

          .loading-img-box {
            position: absolute;
            bottom: 0;
            right: 1rem;

            border: 1px dotted lightgrey;
            border-radius: 4px;
            &.selected {
              border: 2px dotted red;
            }
            width: 5rem;
            height: 5rem;

            display: flex;
            align-items: center;
            justify-content: center;

            img {
              max-width: 4rem;
              max-height: 4rem;
            }
          }
        }

        .map-btn-form-container {
          align-items: center;
          justify-content: flex-start;
          .map-btn-warper {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 4rem;
            width: 8rem;
            &.selected {
              border: 2px dotted red;
              border-radius: 4px;
            }
            .btn {
              margin-right: 0px;
            }
          }
        }

        .map-btn-color-select-container {
          position: relative;
          .for-btn-color-picker {
            position: absolute;
            width: auto;
            left: -6rem;
            bottom: 0;
            z-index: 100;
          }
        }
      }
      .objects-config-box {
        .column {
          padding: 0;
        }
        .d-flex {
          align-items: center;
        }
        overflow: auto;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        transform: translateX(100%);
        transition: transform .25s ease;
        z-index: 100;
        opacity: 1;
        background-color: #fff;
        padding: 1rem;
        &.active {
          transform: translateX(0);
          z-index: 100;
          opacity: 1;
        }
        .form-label {
          min-width: 10rem;
        }
        .tiny-mce-container {
          flex-grow: 2;
          min-height: 340px;
        }
      }
    }

  }
  // .btn {
  //   margin-right: 10px;
  //   margin-bottom: 10px;
  // }
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
