import { createApp } from 'vue'
import Particles from '@tsparticles/vue3'
import { loadSlim } from '@tsparticles/slim'
import { inject } from '@vercel/analytics'
import App from './App.vue'
import { i18n } from './i18n'
import '@/assets/styles/index.scss'

inject()

const app = createApp(App)

app.use(i18n)
app.use(Particles, {
  init: async (engine: Parameters<typeof loadSlim>[0]) => {
    await loadSlim(engine)
  },
})

app.mount('#app')
