<template>
  <section class="quill-container">
    <div class="quill-editor"
      :content="syncHtml"
      @change="onEditorChange($event)"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      v-quill:myQuillEditor="editorOption">
    </div>
  </section>
</template>

<script>
export default {
  name: 'BaloonBody',
  props: ['syncHtml'],
  data () {
    return {
      content: '<p>I am Example</p>',
      editorOption: {
        // some quill options
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block']
          ]
        }
      }
    }
  },
  mounted () {
  },
  methods: {
    // ********************************* editor methods ******************************************
    onEditorBlur (editor) {
      console.log('editor blur!')
    },
    onEditorFocus (editor) {
      console.log('editor focus!')
    },
    onEditorReady (editor) {
      console.log('editor ready!')
      this.$emit('update:syncHtml', editor.html)
    },
    onEditorChange (editor) {
      console.log('editor change!')
      this.$emit('update:syncHtml', editor.html)
    }
  }
}
</script>

<style lang='scss'>
#map {
  height: 100%;
}
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
