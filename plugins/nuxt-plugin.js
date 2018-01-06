import Vue from 'vue'
import Quill from 'quill';
import VueQuillEditor from 'vue-quill-editor'
import  ImageResize  from 'quill-image-resize-module';

Vue.use(VueQuillEditor)

Quill.register('modules/imageResize', ImageResize);
