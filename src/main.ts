import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { churchtoolsClient } from './services/churchtools'

// Import Tailwind CSS
import './style.css'

// only import reset.css in development mode to keep the production bundle small and to simulate CT environment
if (import.meta.env.MODE === 'development') {
    import('./utils/reset.css');
}

declare const window: Window &
    typeof globalThis & {
        settings: {
            base_url?: string;
        };
    };

const baseUrl = window.settings?.base_url ?? import.meta.env.VITE_CHURCHTOOLS_URL;

// Only initialize ChurchTools client if we have a valid URL
if (baseUrl && baseUrl !== 'undefined') {
    churchtoolsClient.setBaseUrl(baseUrl);

    const username = import.meta.env.VITE_USERNAME;
    const password = import.meta.env.VITE_PASSWORD;
    if (import.meta.env.MODE === 'development' && username && password) {
        try {
            await churchtoolsClient.post('/login', { username, password });
        } catch (error) {
            console.warn('ChurchTools login failed, running in demo mode:', error);
        }
    }
} else {
    console.info('No ChurchTools URL configured, running in demo mode with mock data');
}

const KEY = import.meta.env.VITE_KEY;
export { KEY };

// Create and mount Vue app
const app = createApp(App)
app.use(router)
app.mount('#app')
