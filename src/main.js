import Vue from "vue";
import Echarts from "echarts";
import ElementUI from "element-ui";
import App from "./App.vue";
import router from "./router";
import "@/assets/theme/base.css";
import "@/assets/theme/index.css";
import "@/assets/theme/self.css";
import "swiper/swiper-bundle.css";
import "../public/config/env.js";
import VueAwesomeSwiper from "vue-awesome-swiper";

import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.use(VueAwesomeSwiper);
Vue.prototype.$echarts = Echarts;
//引入全局事件总线EventBus
import Bus from "@/utils/eventBus";
import Vuex from "vuex";

import { storeConfig } from "fusion-ui";

Vue.use(Vuex);
Vue.use(Bus);
const store = new Vuex.Store(storeConfig);

Vue.config.productionTip = false;

new Vue({
    store,
    router,
    render: (h) => h(App),
}).$mount("#app");