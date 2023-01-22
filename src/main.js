import "./style.css";
import "ant-design-vue/dist/antd.css";

import Antd from "ant-design-vue";
import App from "./App.vue";
import { createApp } from "vue";

createApp(App).use(Antd).mount("#app");
