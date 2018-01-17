<template>
  <tinymce id="d1" v-model="syncHtml"></tinymce>
</template>

<script>
import tinymce from 'vue-tinymce-editor'

export default {
  name: 'BaloonBody',
  components: {
    tinymce: 'tinymce'
  },
  props: ['syncHtml'],
  data () {
    return {
      content: '<p>I am Example</p>',
      editorOption: {
        // some quill options
        modules: {
          imageResize: {
            displayStyles: {
            backgroundColor: 'black',
            border: 'none',
            color: 'white'
          },
          modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
          },
          toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'size': ['small', 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link']
          ]
        }
      }
    }
  },
  mounted () {
  },
  methods: {
    // ********************************* editor methods ******************************************
    onEditorReady (editor) {
      this.$emit('update:syncHtml', editor.html)
    },
    onEditorChange (editor) {
      this.$emit('update:syncHtml', editor.html)
    }
  }
}
</script>

<style lang='scss'>
  .quill-container {
    width: 100%;
    margin: 0 auto;
    padding: 20px 0;
    .quill-editor {
      min-height: 200px;
      max-height: 400px;
      overflow-y: auto;
    }
  }
</style>
