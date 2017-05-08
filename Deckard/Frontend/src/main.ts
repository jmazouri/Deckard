//Set up vue
declare var require: any

import Vue from 'vue'
import Vuex from 'vuex'

var App = require('./App.vue').default

Vue.use(Vuex);
var store = require('./deckard/state/DataStore').default;

if (localStorage["theme"] == undefined)
{
    store.commit("theme/setTheme", "plain");
}
else
{
    store.commit("theme/setTheme", localStorage["theme"])
}

new Vue({
  el: '#app',
  store,
  components: { App },
  render: h => h('app')
});