//Set up vue
declare var require: any

import Vue from 'vue'
import Vuex from 'vuex'

if (localStorage["theme"] == undefined)
{
    localStorage["theme"] = "plain";
}

var App = require('./App.vue').default

Vue.use(Vuex);
var store = require('./deckard/state/DataStore').default;

new Vue({
  el: '#app',
  store,
  components: { App },
  render: h => h('app')
});