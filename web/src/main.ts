import { createApp } from 'vue';
// import vue from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import antDesign from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import * as antIcons from '@ant-design/icons-vue';

const app = createApp(App);

// app.provide('$message', message);
// app.config.globalProperties.$message = message;

app.use(createPinia());
app.use(router);
app.use(antDesign);

const icons: any = antIcons;

for (const i in icons) {
  app.component(i, icons[i]);
}

app.mount('#app');
