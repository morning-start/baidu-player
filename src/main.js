import "./style.css";
import "ant-design-vue/dist/antd.css";

import Antd from "ant-design-vue";
import App from "./App.vue";
import { createApp } from "vue";

const app = createApp(App);
app.use(Antd);
app.mount("#app");
