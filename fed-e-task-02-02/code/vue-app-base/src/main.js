import Vue from 'vue'
import App from './App.vue'

import './style.less'

Vue.config.productionTip = false
console.log(333333)
console.log('------------------------------------', API_BASE_URL)

new Vue({
  render: h => h(App),
}).$mount('#app')
