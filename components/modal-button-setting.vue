<template>
  <div class="modal" :class="{active: show}">
  <a href="#close" class="modal-overlay" aria-label="Close" @click="Cancel"></a>
  <div class="modal-container">
    <div class="modal-header">
      <button class="btn btn-clear float-right"></button>
      <div class="modal-title h5">Стиль кнопки:</div>
    </div>
    <div class="modal-body">
      <div class="content">
          <div class="column d-flex mt-2 btn-result-config">
            <a ref="btnResult" :style="btnStyle">{{btnText}}</a>
            <label class="form-label">Надпись:</label>
            <input class="form-input" type="text" v-model="btnText" :style="{width: '8rem'}">
            <label class="form-label">Ссылка:</label>
            <input class="form-input" type="text" v-model="btnHref" :style="{width: '8rem'}">
          </div>
          <div class="column d-flex mt-2 btn-color-config">
            <div class="column d-flex">
              <h5>Цвет фона:</h5>
              <div class="btn-color-color"
                :style="{'background-color': backgroundColor.hex}"
                @click="pickerBackground=!pickerBackground">
                <div class="background-color-picker" v-if="pickerBackground">
                  <sketch-picker v-model="backgroundColor"/>
                </div>
              </div>
            </div>
            <div class="column d-flex">
              <h5 :style="{'min-width': '4rem'}">Тень:</h5>
              <toggle-button v-model="needShadow" :labels="{checked: 'ДА', unchecked: 'НЕТ'}"/>
            </div>
          </div>

          <div class="column d-flex mt-2 btn-text-config">
            <h5>Текст:</h5>
            <label class="form-label">Размер:</label>
            <input class="form-input" type="number" v-model="fontSize">
            <label class="form-label">Насыщенность:</label>
            <input class="form-input" type="number" v-model="fontWeight">
            <label class="form-label">Цвет:</label>

            <div class="btn-color-color"
              :style="{'background-color': color.hex}"
              @click="pickerColor=!pickerColor">
              <div class="color-color-picker" v-if="pickerColor">
                <sketch-picker v-model="color"/>
              </div>
            </div>
          </div>
          <div class="column d-flex mt-2 btn-border-config">
            <h5>Бордюр:</h5>
            <label class="form-label">Толщина:</label>
            <input class="form-input" type="number" v-model="borderWidth">
            <label class="form-label">Скругление:</label>
            <input class="form-input" type="number" v-model="borderRadius">
            <label class="form-label">Цвет:</label>

              <div class="btn-color-color"
                :style="{'background-color': borderColor.hex}"
                @click="pickerBorder=!pickerBorder">
                <div class="border-color-picker" v-if="pickerBorder">
                  <sketch-picker v-model="borderColor"/>
                </div>
              </div>
          </div>
          <div class="column d-flex mt-2 btn-padding-config">
            <h5>Отступы:</h5>
            <label class="form-label">Сверху/Снизу:</label>
            <input class="form-input" type="number" v-model="padding.top">
            <label class="form-label">Слева/Справа:</label>
            <input class="form-input" type="number" v-model="padding.right">
          </div>
          <div class="column d-flex mt-2 btn-margin-config">
            <h5>Поля:</h5>
            <label class="form-label">Сверху/Снизу:</label>
            <input class="form-input" type="number" v-model="margin.top">
            <label class="form-label">Слева/Справа:</label>
            <input class="form-input" type="number" v-model="margin.right">
          </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary mx-2" @click="Save">Сохранить</button>
      <button class="btn" @click="Cancel">Отменить</button>

    </div>
  </div>
</div>
</template>

<script>
import { Sketch } from 'vue-color'

export default {
  name: 'modalButtonSetting',
  props: {
    show: {
      default: false
    }
  },
  components: {
    'sketch-picker': Sketch,
  },
  data () {
    return {
      btnText: 'Открыть',
      btnHref: '#',
      btnColor: {
        hex: '#194d33'
      },
      pickerBackground: false,
      pickerColor: false,
      pickerBorder: false,
      backgroundColor: {
        hex: '#26C475'
      },
      fontSize: 14,
      fontWeight: 500,
      color: {
        hex: '#fff'
      },
      borderWidth: 1,
      borderRadius: 3,
      borderColor: {
        hex: '#194d33'
      },
      shadowWidth: 10,
      shadowOpacity: .5,
      padding: {
        top: 4,
        right: 20,
        bottom: 4,
        left: 12
      },
      margin: {
        top: 4,
        right: 12,
        bottom: 4,
        left: 12
      },
      needShadow: true
    }
  },
  methods: {
    updateData (cfg) {
      this.btnText = cfg.btnText
      this.btnHref = cfg.btnHref
      this.btnColor = cfg.btnColor
      this.pickerBackground = cfg.pickerBackground
      this.pickerColor = cfg.pickerColor
      this.pickerBorder = cfg.pickerBorder
      this.backgroundColor = cfg.backgroundColor
      this.fontSize = cfg.fontSize
      this.fontWeight = cfg.fontWeight
      this.color = cfg.color
      this.borderWidth = cfg.borderWidth
      this.borderRadius = cfg.borderRadius
      this.borderColor = cfg.borderColor
      this.shadowWidth = cfg.shadowWidth
      this.shadowOpacity = cfg.shadowOpacity
      this.padding = cfg.padding
      this.margin = cfg.margin
      this.needShadow = cfg.needShadow
    },
    updateColorPicker(val) {
    },
    Save () {
      const style = this.$refs.btnResult.style.cssText
      const x = document.createElement('STYLE');
      const a = document.createTextNode(`.button-in-balloon, .button-in-balloon:hover { ${style} }`);
      x.appendChild(a);
      document.head.appendChild(x);

      this.$emit('save', {
        href: this.btnHref,
        caption: this.btnText,
        style: style,
        data: {
          btnText: this.btnText,
          btnHref: this.btnHref,
          btnColor: this.btnColor,
          pickerBackground: this.pickerBackground,
          pickerColor: this.pickerColor,
          pickerBorder: this.pickerBorder,
          backgroundColor: this.backgroundColor,
          fontSize: this.fontSize,
          fontWeight: this.fontWeight,
          color: this.color,
          borderWidth: this.borderWidth,
          borderRadius: this.borderRadius,
          borderColor: this.borderColor,
          shadowWidth: this.shadowWidth,
          shadowOpacity: this.shadowOpacity,
          padding: this.padding,
          margin: this.margin,
          needShadow: this.needShadow
        }
      })
    },
    Cancel () {
      this.$emit('close')
    }
  },
  computed: {
    btnStyle () {
      return {
        'background-color': this.backgroundColor.hex,
        'border-width': this.borderWidth + 'px',
        'border-style': 'solid',
        'border-color': this.borderColor.hex,
        'border-radius': this.borderRadius + 'px',
        'color': this.color.hex,
        'padding': this.btnPadding,
        'text-align': 'center',
        'text-decoration': 'none',
        'display': 'inline-block',
        'font-size': this.fontSize + 'px',
        'font-weight': this.fontWeight,
        'margin': this.btnMargin,
        'cursor': 'pointer',
        'box-shadow': this.btnShadow
      }
    },
    btnPadding () {
      return this.padding.top + 'px ' + this.padding.right + 'px ' // + this.padding.bottom + 'px ' + this.padding.left + 'px'
    },
    btnMargin () {
      return this.margin.top + 'px ' + this.margin.right + 'px ' // + this.padding.bottom + 'px ' + this.padding.left + 'px'
    },
    btnShadow () {
      return this.needShadow ? '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)' : 'none'
    }
  }
}
</script>

<style lang='scss' scoped>
  .modal-body {
    min-height: 55vh;
    .content {
      h5 {
        margin-bottom: .5em;
        margin-top: .3rem;
        min-width: 120px;
      }
      .column {
        padding: 0;
      }
      .d-flex {
        justify-content: flex-start;
        align-items: center;
        margin-top: 1rem;
      }
      input {
        width: 60px;
        height: 1.5rem;
        font-size: 12px;
        margin-left: .3rem;
        margin-right: 1rem;
      }


      .btn-color-color {
        margin-left: .3rem;
        margin-right: 1rem;
        position: relative;
        width: 50px;
        height: 1.5rem;
        border: 1px solid black;
        .background-color-picker {
            position: absolute;
            top: -70px;
            left: 50px;
            z-index: 100;
          }
        .color-color-picker {
          position: absolute;
          top: -120px;
          right: 50px;
          z-index: 100;
        }
        .border-color-picker {
          position: absolute;
          top: -170px;
          right: 50px;
          z-index: 100;
        }
      }

    }
  }
</style>
