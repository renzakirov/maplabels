<template>
  <div class="container login-form-container">
    <div class="columns">
      <div class="column col-3 col-mx-auto login-form">
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
export default {
  data () {
    return {
      formEmail: '',
      formPassword: ''
    }
  },
  methods: {
    emailLogin () {
      this.$store.dispatch('signInWithEmail', {
        email: this.formEmail,
        password: this.formPassword
      }).then(() => {
        this.formEmail = ''
        this.formPassword = ''

      }).catch((e) => {
        console.log(e.message);
      })
    },
    emailSignUp () {
      this.$store.dispatch('signUpWithEmail', {
        email: this.formEmail,
        password: this.formPassword
      }).then(() => {
        this.formEmail = ''
        this.formPassword = ''
        console.log('inside then statement on login');
      }).catch((e) => {
        console.log(e.message);
      })
    },
    googleSignUp () {
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
