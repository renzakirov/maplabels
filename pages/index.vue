<template>
  <div class="container login-form-container">
    <div class="columns">
      <bounce-loader class="column col-1 col-mx-auto" style="margin-top: 30vh;" :loading="loading" :color="'#5755d9'"></bounce-loader>
      <div class="column col-3 col-mx-auto login-form" v-show="!loading">
        <h3>Вход:</h3>
        <div class="divider"></div>
        <div class="form-group google-login">
          <h4>Войти с аккаунтом Google:</h4>
          <button class="btn btn-block" @click="googleSignUp">Вход</button>
        </div>
        <div class="divider"></div>
        <h4>Войти с помощью e-mail:</h4>
        <div class="form-group">
          <label class="form-label">E-Mail</label>
          <input class="form-input" type="text" v-model="formEmail">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input class="form-input" type="password" v-model="formPassword">
          <div class="button-block text-right">
            <button class="btn" @click="emailLogin">Вход</button>
            <button class="btn" @click="emailSignUp">Регистрация</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  components: {
    'bounce-loader': PulseLoader
  },
  data () {
    return {
      formEmail: '',
      formPassword: '',
      loading: false
    }
  },
  methods: {
    emailLogin () {
      this.$store.dispatch('signInWithEmail', {
        email: this.formEmail,
        password: this.formPassword
      })
      this.loading = true
      setInterval(() => {
        this.formEmail = ''
        this.formPassword = ''
        this.$router.push('/map-edit')
      }, 3000)
    },
    emailSignUp () {
      this.$store.dispatch('signUpWithEmail', {
        email: this.formEmail,
        password: this.formPassword
      })
      this.loading = true
      setInterval(() => {
        this.formEmail = ''
        this.formPassword = ''
        this.$router.push('/map-edit')
      }, 3000)
    },
    googleSignUp () {
      this.loading = true
      this.$store.dispatch('signInWithGoogle').then(() => {
        console.log('inside then statement on login');
      }).catch((e) => {
        console.log(e.message);
      })
    }

  }
}
</script>

<style lang='scss' scoped>
@import "~spectre.css/src/_variables.scss";

.login-form-container {
  margin-top: 5rem;
  .login-form{
    border: 1px solid $primary-color;
    // border-radius: 3px;
    padding: 1rem;
    h4 {
      font-weight: 400;
    }
    .google-login {
      margin: 1em 0;
    }
    .button-block {
      margin-top: 1rem;
      button {
        margin-left: 0.5em;
      }
    }
  }
}
</style>
