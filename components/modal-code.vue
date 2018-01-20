<template>
  <div class="modal" :class="{active: show}">
  <a href="#close" class="modal-overlay" aria-label="Close"></a>
  <div class="modal-container">
    <div class="modal-header">
      <button class="btn btn-clear float-right" @click="Cancel"></button>
      <div class="modal-title h5">Код для вставки:</div>
    </div>
    <div class="modal-body">
      <div class="content">
        <div class="form-group">
          <textarea class="form-input" rows="6" :value="code"></textarea>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn" @click="Cancel">ОК</button>

    </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'modalCode',
  props: {
    show: {
      default: false
    }
  },

  methods: {
    Cancel () {
      this.$emit('close')
    },
    saveCodeToDB ({mapKey, baseUrl, style}) {
      this.mapJsonURL = baseUrl
      this.mapKey = mapKey

      const aFileParts = [baseUrl, this.js]; // an array consisting of a single DOMString
      const oMyBlob = new Blob(aFileParts, {type : 'text/javascript'}); // the blob
      this.$store.dispatch('imageToStorage', {
        file: oMyBlob,
        fileName: mapKey + '.js'
      }).then(url => {
        console.log(url)
        this.codeUrl = url
        this.code = style
        this.code = this.code + `<script src="${url}" type="text/javascript"></` + 'script>'
        this.code = this.code + `<div id="map${mapKey}"></div>`
      }).catch(err => {
        console.log('Error', err)
      })
    }
  },

  data () {
    return {
      code: '', // то что покажем в textarea
      codeUrl: '', // url в базе, где лежит js код
      mapJsonURL: ``, // url в базе, где лежит json карты
    }
  },
  computed: {
    js () {
      return `
        let myMap;
        const yandexMapScript = document.createElement('SCRIPT')
        yandexMapScript.setAttribute('src', 'https://api-maps.yandex.ru/2.1/?lang=ru_RU')
        yandexMapScript.setAttribute('async', '')
        yandexMapScript.setAttribute('defer', '')
        document.body.appendChild(yandexMapScript)
        yandexMapScript.onload = () => {
          window.ymaps.ready(() => {
            map_init()
          })
        }

        function map_init() {
        // Инициализируем карту.
          myMap = new ymaps.Map('map${this.mapKey}', {
            center: [47.219861612023976,39.732081502929695],
            zoom: 8,
            controls: ['zoomControl', 'searchControl', 'fullscreenControl', 'geolocationControl']
          }, {
            suppressMapOpenBlock: true
          });

          myMap.margin.addArea({
            top: 0,
            left: 0,
            width: '10%',
            height: '100%'
          });

          myMap.margin.addArea({
            top: 0,
            right: 0,
            width: '100%',
            height: '10%'
          });

          $.getJSON(baseUrl, buildMapFromJson);

        }

        function buildMapFromJson (map) {
          if (!map) {
            console.log('Json with map data not loaded');
            return;
          }
          if (!myMap) {
            console.log('Map not loaded');
            return;
          }
          myMap.setCenter(map.map_center || [45,45])
          myMap.setZoom(map.zoom || 8)

          const preset = map.icon.preset

          const x = document.createElement('STYLE');
          const a = document.createTextNode('.button-in-balloon, .button-in-balloon:hover {' + map.btn_cfg.btnStyle + '}');
          //const b = document.createTextNode(map.map_style.style);
          x.appendChild(a);
          //x.appendChild(b);
          document.head.appendChild(x);

          if (!map.map_json || !map.map_json.length) {
            console.log('Map objects data not found');
            return
          }
          map.map_json.forEach(el => {
            console.log('jsonMap.el = ', el)
            let placemark = new window.ymaps.Placemark(el.coord, {
              iconContent: el.iconContent,
              hintContent: el.hintContent,
              balloonContentHeader: el.balloonContentHeader,
              balloonContentBody: el.balloonContentBody,
              balloonContentFooter: el.balloonContentFooter
            }, {
              preset: preset,
              draggable: false,
              visible: true
            })
            myMap.geoObjects.add(placemark)
          })
        };`
    }
  }
}
</script>

<style lang='scss' scoped>
  .modal-body {
    .content {

    }
  }
</style>
