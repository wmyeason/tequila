import Vue from "vue";
import router from "./router";
import Antd from "ant-design-vue";
import element from 'element-ui';
import App from "./App.vue";

import "ant-design-vue/dist/antd.css";

import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false;

Vue.use(Antd);
Vue.use(element);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
