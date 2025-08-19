import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import inheritAttrs from 'vite-plugin-vue-setup-inherit-attrs';
import * as path from 'path'

// https://vitejs.dev/config/
export default({mode}) => {
    process.env = {
        ...process.env,
        ...loadEnv(mode, process.cwd(), 'MM_')
    }

    const plugins = [vue(), inheritAttrs()]
    if (mode == 'development') {
        // inspect : http://localhost:3000/__inspect
        plugins.push(Inspect())
    }

    return defineConfig({        
        base: process.env.MM_APP_URL + '/',                
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
            port: 4000,
            fs: {
                allow: ['../public/publish', '../public/block', '../mobile']
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
