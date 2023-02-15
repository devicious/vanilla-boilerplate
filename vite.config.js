import { defineConfig, loadEnv } from 'vite'
import * as path from 'path';
import babel from 'vite-plugin-babel';

export default defineConfig(({ command, mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '')

    if (command === 'serve') {
        return {
            define: {
                __APP_ENV__: env.APP_ENV,
            },
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
            plugins: [
                // Babel will try to pick up Babel config files (.babelrc or .babelrc.json)
                babel(),
                // ...
            ],
            // dev specific config
        }
    } else {
        // command === 'build'
        return {
            // build specific config
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
            plugins: [
                // Babel will try to pick up Babel config files (.babelrc or .babelrc.json)
                babel(),
                // ...
            ],
        }
    }
})