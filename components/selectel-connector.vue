<template>

</template>

<script>
import axios from 'axios'

export default {
  name: 'selectelConnector',
  data () {
    return {
      baseUrl: 'http://202825.selcdn.ru/estorag/maplabel/',
      token: '',
      tokenExpires: ''
    }
  },
  methods: {
    loadFileToSelectel (file, fileName) {
      if (!file) {
        console.log('File not defined')
        return
      }
      if (this.token) {
        this.putFileToSelectel(file, fileName)
        return
      }
      this.selectel_auth().then(resp => {
        this.token = resp.access.token.id
        this.tokenExpires = resp.access.token.id
        this.putFileToSelectel(file, fileName)
      })
    },
    putFileToSelectel (file, fileName) {
      if (!file) {
        console.log('File not defined')
        return
      } else if (!this.token) {
        console.log('Token not defined')
        return
      }
      // let formData = new FormData()
      // formData.append('file', file)
      const url = this.baseUrl + fileName
      return axios({
        method: 'put',
        url: url,
        headers: {'Accept': 'application/json', 'X-Auth-Token': this.token},
        data: file
      }).then(resp => {
        this.$emit('file-loaded', {type: file.type, url: url})
        return url
      }).catch(err => {
        console.log('loadFileToSelectel err', err)
      })
    },

    getFileFromSelectel (fileName) {
      if (!fileName) {
        console.log('fileName empty')
        return
      }
      if (this.token) {
        this.selectel_get(fileName)
        return
      }
      this.selectel_auth().then(resp => {
        this.token = resp.data.token.id
        this.tokenExpires = resp.data.token.expires
        this.selectel_get(fileName)
      })
    },

    selectel_get (fileName) {
      return axios({
        method: 'get',
        url: this.baseUrl + fileName,
        headers: {'Accept': 'application/json', 'X-Auth-Token': this.token}
      }).then(resp => {
        this.$emit('get-file', resp.data)
        return resp.data
      }).catch(err => {
        console.log('selectel_get err', err)
      })
    },
    selectel_auth () {
      const cred = {
        'auth': {
          'passwordCredentials': {
            'username': '58735_renza',
            'password': 'rFDE8RSaUB'
          }
        }
      }
      return axios({
        method: 'post',
        url: 'https://auth.selcdn.ru/tokens',
        data: cred,
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(resp => {
        return resp.data
      }).catch(err => {
        console.log('selectel_auth err', err)
      })
    }
  }

}
</script>

<style lang='scss'>
.btn {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
