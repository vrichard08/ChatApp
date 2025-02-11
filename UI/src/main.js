/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins';

import '@/styles/common.scss';
import '@/styles/main.scss';

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';
import { appFunctions } from '@/functions/AppFunctions';

const app = createApp(App);

registerPlugins(app);

app.mount('#app');

if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = function () {
    let voices = window.speechSynthesis.getVoices();
    appFunctions.voices.value = voices;
  };
}
