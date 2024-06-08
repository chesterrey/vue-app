import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Lara from "./presets/lara";
import router from "./router";
import ToastService from 'primevue/toastservice';

const app = createApp(App)
app.use(PrimeVue, {
  unstyled: true,
  pt: Lara,
})
app.use(ToastService);
app.use(router);
app.mount("#app");
