<template>
  <section class="quill-container">
    <div class="quill-editor"
      :content="syncHtml"
      @change="onEditorChange($event)"
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
