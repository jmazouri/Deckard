declare var require: any

import Vue from 'vue'

var App = require('./App.vue').default

Vue.config.performance = true;

new Vue({
  el: '#app',
  components: { App },
  render: h => h('app')
})