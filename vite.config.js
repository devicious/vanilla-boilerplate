import { defineConfig, loadEnv } from 'vite';
import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig(({ command, mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '');
    const fragments = readdirSync(resolve(__dirname, 'src/fragments'), { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(dir => resolve(__dirname, 'src/fragments', dir.name));

    const templates = readdirSync(resolve(__dirname, 'src/templates'), { withFileTypes: true })
        .filter(entry => {
            return entry.isFile() && entry.name.includes('.html');
        })
        .reduce((templates, template) => {
            const name = template.name.replace('.html', '');
            templates[name] = resolve(__dirname, 'src/templates', `${name}.html`);
            return templates;
        }, {});

    const images = readdirSync(resolve(__dirname, 'public/temp'), { withFileTypes: true })
        .filter(entry => {
            return entry.isFile();
        })
        .map(template => template.name);

    const templateMeta = Object.keys(templates).map(id => {
        const templatePath = templates[id];
        const { progress } = retrieveMeta(templatePath);
        return {
            id,
            path: templatePath,
            progress,
        };
    });

    function retrieveMeta(filePath) {
        let meta = {
            progress: 0,
        };
        const file = readFileSync(filePath, 'utf8');
        const regex = /<!--META:(.+)-->/gim;
        const raw = regex.exec(file);
        if (raw && raw.length) {
            meta = JSON.parse(raw[1]);
        }

        return meta;
    }

    return {
        build: {
            target: command === "build" ? "es2015" : "modules",
            manifest: command === "build",
            chunkSizeWarningLimit: 1600,
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html'),
                    ...templates,
                },
            },
        },
        define: {
            __APP_ENV__: env.APP_ENV,
        },
        alias: {
            '@': resolve(__dirname, 'src'),
        },
        plugins: [
            handlebars({
                context: {
                    appName: env.VITE_APP_NAME,
                    version: env.VITE_VERSION,
                    templates: templateMeta,
                },
                reloadOnPartialChange: true,
                partialDirectory: [resolve(__dirname, 'src/templates'), ...fragments],
                helpers: {
                    variant: (className, block) => {
                        block.data.variance = className;
                        return block.fn(this);
                    },
                    times: (n, block) => {
                        let accum = '';
                        for (let i = 0; i < n; ++i) {
                            block.data.index = i;
                            block.data.first = i === 0;
                            block.data.last = i === n - 1;
                            accum += block.fn(this);
                        }

                        return accum;
                    },
                    randomImage: () => {
                        return images[Math.floor(Math.random() * images.length)];
                    },
                    ifCond: (op1, operator, op2, options) => {
                        options.data.op1 = op1;
                        options.data.op2 = op2;
                        switch (operator) {
                            case '===':
                                return op1 === op2 ? options.fn(this) : options.inverse(this);
                            case '!==':
                                return op1 !== op2 ? options.fn(this) : options.inverse(this);
                            case '<':
                                return op1 < op2 ? options.fn(this) : options.inverse(this);
                            case '<=':
                                return op1 <= op2 ? options.fn(this) : options.inverse(this);
                            case '>':
                                return op1 > op2 ? options.fn(this) : options.inverse(this);
                            case '>=':
                                return op1 >= op2 ? options.fn(this) : options.inverse(this);
                            case '&&':
                                return op1 && op2 ? options.fn(this) : options.inverse(this);
                            case '||':
                                return op1 || op2 ? options.fn(this) : options.inverse(this);
                            default:
                                return options.inverse(this);
                        }
                    },
                },
            }),
        ],
    };
});
