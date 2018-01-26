<template>
  <div class="toast toast-success toast-messages" v-show="msg.show">
    <button class="btn btn-clear float-right"></button>
    <!--h6>{{msg.header}}</h6-->
    {{msg.text}}
  </div>
</template>

<script>
export default {
  name: 'toastMessages',
  props: {
    msg: {
      type: Object,
      default () {
        return {
          show: false,
          header: '',
          text: '',
          timer: 3000,
          type: ''
        }
      }
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang='scss' scoped>
  .toast-messages {
    position: fixed;
    bottom: 0;
    width: 20rem;
    left: calc(50% - 10rem);
    z-index: 200;
  }
</style>
