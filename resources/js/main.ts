import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import SettingsLayout from '@/layouts/settings/Layout.vue'
import { initializeFlashToast } from '@/lib/flashToast'
import { createInertiaApp } from '@inertiajs/vue3'
import { createBootstrap } from 'bootstrap-vue-next'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '../styles/main.scss'

const appName = 'Oasis Quartermaster'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const bootstrap = createBootstrap({
    components: {
        BTooltip: {
            delay: { show: 300, hide: 0 },
            teleportTo: 'body',
        },
    },
})

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name.startsWith('auth/'):
                return AuthLayout
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout]
            default:
                return AppLayout
        }
    },
    progress: {
        color: '#4B5563',
    },
    withApp(app) {
        app.config.performance = true
        app.use(bootstrap)
        app.use(pinia)
    },
})

if (typeof window !== 'undefined') {
    // This will listen for flash toast data from the server...
    initializeFlashToast()
}
