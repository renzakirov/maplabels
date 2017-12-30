<template>
  <div class="container">
    <div class="columns">
      <div class="column col-12">
        <h1>ПРИВЕТ</h1>
      </div>
      <div class="column col-6">
        <div id="map" :style="{height: '500px', width: '90%', margin: 'auto'}"></div>
      </div>
      <div class="column col-6">
        <button class="btn" @click="addObject">Add object</button>
        <button class="btn" @click="deleteObject" :disabled="(!this.myMap || !this.selectedObject || !this.selectedObject.placemark)">Delete object</button>
        <fieldset :disabled="!showForm">
          <div class="form-group">
            <label class="form-label">Coordinates:</label>
            <div class="columns">
              <div class="column col-4">
                <input class="form-input" type="text" v-model="selectedObject.coord[0]">
              </div>
              <div class="column col-4">
                <input class="form-input" type="text" v-model="selectedObject.coord[1]">
              </div>
            </div>
            <label class="form-label">iconContent</label>
            <input class="form-input" type="text" v-model="selectedObject.iconContent">
            <label class="form-label">hintContent</label>
            <input class="form-input" type="text" v-model="selectedObject.hintContent">
            <label class="form-label">balloonContentHeader</label>
            <input class="form-input" type="text" v-model="selectedObject.balloonContentHeader">
            <label class="form-label">balloonContentBody</label>
            <textarea class="form-input" rows="3" v-model="selectedObject.balloonContentBody" :style="{overflow: 'hidden'}"></textarea>
            <label class="form-label">balloonContentFooter</label>
            <input class="form-input" type="text" v-model="selectedObject.balloonContentFooter">
            <button class="btn" @click="SaveObject">Save</button>
            <button class="btn" @click="CancelObject">Cancel</button>
          </div>
        </fieldset>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      quill: {},
      myMap: {},
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
      config: {
        theme: 'modern',
        fontsize_formats: '8px 10px 12px 14px 16px 18px 20px 22px 24px 26px 39px 34px 38px 42px 48px',
        plugins: 'print preview fullpage powerpaste searchreplace autolink',
        toolbar1: 'formatselect fontsizeselect | bold italic strikethrough forecolor backcolor link'
      }
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

  },
  methods: {
    item_map_init () {
      this.myMap = new window.ymaps.Map('map', {
        center: [47.222543, 39.718732],
        zoom: 8
      })
    },
    addObject () {
      if (!this.myMap) return
      this.CancelObject()
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
      const coord = this.selectedObject.placemark.geometry.getCoordinates()
      this.selectedObject.coord = coord.slice()
    },
    SaveObject () {
      this.selectedObject.placemark.properties.set({
        iconContent: this.selectedObject.iconContent,
        hintContent: this.selectedObject.hintContent,
        balloonContentHeader: this.selectedObject.balloonContentHeader,
        balloonContentBody: this.selectedObject.balloonContentBody,
        balloonContentFooter: this.selectedObject.balloonContentFooter
      })
      this.CancelObject()
    },
    CancelObject () {
      if (this.selectedObject.placemark) {
        this.selectedObject.placemark.options.set({
          preset: 'islands#redCircleDotIcon',
          draggable: false
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
    }
  }
}
</script>

<style lang='scss'>

</style>
