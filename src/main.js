import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueMaterial from 'vue-material'
import Toasted from 'vue-toasted';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

Vue.config.productionTip = false;
Vue.use(VueMaterial);
Vue.material.locale.dateFormat = 'dd/MM/yyyy';
Vue.use(Toasted, {
  iconPack: 'fontawesome',
  duration: 2500
});

new Vue({
  router,
  render: h => h(App),
  created() {
    this.$router.push('/');
  }
}).$mount('#app');
