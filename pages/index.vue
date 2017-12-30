<template>
  <div class="container">
    <div class="columns">
      <div class="column col-4 col-mr-auto">
        <div class="form-group">
          <label class="form-label">Sign In with Google</label>
          <button class="btn" @click="googleSignUp">Sign In</button>
        </div>
        <div class="form-group">
          <label class="form-label">E-Mail</label>
          <input class="form-input" type="text" v-model="formEmail">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input class="form-input" type="password" v-model="formPassword">
        </div>
        <button class="btn" @click="emailLogin">Sign In</button>
        <button class="btn" @click="emailSignUp">Sign Up</button>
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
      console.log(this.formEmail, this.formPassword)
    },
    emailSignUp () {
      console.log(this.formEmail, this.formPassword)
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
      console.log(this.formEmail, this.formPassword)
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
