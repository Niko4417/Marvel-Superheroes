import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {createPinia} from "pinia";
import router from "./router/index.js";
import {mdi} from "vuetify/iconsets/mdi";
import '@mdi/font/css/materialdesignicons.css'


const vuetify = createVuetify({
    icons: {
        defaultSet: 'mdi',
        sets: {
            mdi,
        },
    },
    components,
    directives,
})
createApp(App).use(createPinia()).use(vuetify).use(router).mount('#app')


