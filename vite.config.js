import { defineConfig, loadEnv } from 'vite';
import * as path from 'path';
import * as fs from 'fs';
import babel from 'vite-plugin-babel';
import handlebars from 'vite-plugin-handlebars';


export default defineConfig(({ command, mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '');
    const fragments_path = path.resolve(__dirname, 'src/fragments');
    const fragments = fs.readdirSync(fragments_path, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map((dir) => path.resolve(__dirname, 'src/fragments', dir.name));

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
            handlebars({
                context: {
                    appName: env.APP_NAME,
                    version: env.VERSION
                },
                reloadOnPartialChange: true,
                partialDirectory: [
                    path.resolve(__dirname, 'src/templates'),
                    ...fragments
                ],
            }),
            // ...
        ],
        // dev specific config
    };
});
