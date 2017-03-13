declare var require: any

import Vue from 'vue'

var App = require('./App.vue').default

new Vue({
  el: '#app',
  components: { App },
  render: h => h('app')
})