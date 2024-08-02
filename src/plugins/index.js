/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import router from '@/router'
import vuetify from './vuetify'
import Notifications from '@kyvg/vue3-notification'

export function registerPlugins (app) {
  app.use(vuetify)
  app.use(router)
  app.use(Notifications)
}
