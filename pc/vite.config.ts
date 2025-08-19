import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import {VitePWA, VitePWAOptions} from 'vite-plugin-pwa'
import inheritAttrs from 'vite-plugin-vue-setup-inherit-attrs';
import * as path from 'path'

// https://vitejs.dev/config/
export default({mode}) => {
    process.env = {
        ...process.env,
        ...loadEnv(mode, process.cwd(), 'MM_')
    }

    const pwaOptions: Partial<VitePWAOptions> = {
        srcDir: 'src',
        filename: 'sw.ts',
        includeAssets: [
            'favicon.svg',
            'favicon.ico', 
            'robots.txt', 
            'apple-touch-icon.png'
        ],
        devOptions: {
            enabled: true,
            type: 'module',
            navigateFallback: 'index.html'
        },
        strategies: 'injectManifest',
        manifest: {
            name: process.env.MM_APP_NAME,
            short_name: process.env.MM_APP_NAME,
            description: 'Description of your app',
            theme_color: '#ffffff',
            icons: [
                {
                    src: 'pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                }, 
                {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }, 
                {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable'
                }
            ]
        }
    }

    const plugins = [vue(), VitePWA(pwaOptions), inheritAttrs()]
    if (mode == 'development') {
        // inspect : http://localhost:3000/__inspect
        plugins.push(Inspect())
    }

    return defineConfig({
        base: '/',          
        plugins: plugins,        
        publicDir: 'src/assets/publish',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                $: path.resolve(__dirname, '../common'),
                '@publish': path.resolve(__dirname, 'src/assets/publish'),
                '@globalPublish': path.resolve(__dirname, '../public/publish'),
            }
        },        
        envPrefix: 'MM_',
        server: {
            port: 4001,
            fs: {
                allow: ['../public/publish', '../public/block', '../pc']
            },
            hmr: {
                port: process.env.MM_APP_PROTOCOL == 'https'
                    ? 443
                    : 0,
                protocol: process.env.MM_APP_PROTOCOL == 'https'
                    ? 'wss'
                    : 'ws'
            }
        }
    })
}
