//@ts-ignore
import path from "path";


//@ts-ignore
export default defineNuxtConfig(
    {
        devtools: {
            enabled: true,
        },
        experimental: {
            renderJsonPayloads: false
        },

        ssr: false,
        spaLoadingTemplate: false,

        colorMode: {
            preference: 'light',
        },
        imports: {
            dirs: ["core", "stores", "composables", "components", "services", "features"]
        },
        build: {
            // transpile: ['components/*', 'pages/*','composables/*'],
            //@ts-ignore
            optimization: {
                runtimeChunk: "single",
            }
        },
        ignore: [
            "pages/ignore/*"
        ],

        css: [
            "~/assets/css/app.css",
            "vue-toast-notification/dist/theme-default.css",
        ],

        postcss: {
            plugins: {
                tailwindcss: {},
                autoprefixer: {},
            },
        },

        modules: [
            '@pinia/nuxt',
            '@pinia-plugin-persistedstate/nuxt',
            '@nuxtjs/i18n',
            'nuxt-lodash',
            // '@nuxtjs/tailwindcss',
            // 'nuxt-appwrite',
            '@nuxtjs/strapi',
            '@nuxt/ui',
            '@sentry/nuxt/module',
            "@nuxt/image"
        ],
        sentry: {
            sourceMapsUploadOptions: {
                org: "evacorp",
                project: "fluttergigs",
                authToken: "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",
            },
        },
        image: {
            quality: 100,
        },

        runtimeConfig: {
            strapiEndpoint: "",
            posthogKey: "",
            posthogProjectId: "",
            apiBaseUrl: "",
            googleGenerativeAiApiKey: "",
            public: {
                strapiEndpoint: "",
                posthogKey: "",
                posthogProjectId: "",
                apiBaseUrl: "",
                googleGenerativeAiApiKey: "",
                sentry: {
                    dsn: '',
                    environment: ''
                }
            },
        },

        strapi: {
            //@ts-ignore
            url: process.env.STRAPI_URL || 'http://localhost:1337',
            prefix: '/api',
            version: 'v4',
            cookie: {},
            cookieName: 'strapi_jwt'
        },

        /*appwrite: {
            endpoint: process.env.NUXT_APPWRITE_ENDPOINT,
            project: process.env.NUXT_APPWRITE_PROJECT_ID,
        },*/
        i18n: {
            locales: [
                {code: "en", file: "en.json"},
                {code: "fr", file: "fr.json"},
            ],
            lazy: true,
            defaultLocale: "fr",
            strategy: "no_prefix",
            langDir: "locales/",
        },

        plugins: [
            {src: "~/plugins/tippy", mode: "client"},
            {src: "~/plugins/vue-easymde", mode: "client"},
            {src: "~/plugins/vue3-apexcharts", mode: "client"},
            {src: "~/plugins/store"},
            {src: "~/plugins/toaster", mode: "client"},
            {src: "~/plugins/date-format", mode: "all"},
        ],

        vite: {
            // optimizeDeps: { include: ["quill"] },
            resolve: {
                alias: {
                    vue: path.resolve('./node_modules/vue', 'dist', 'vue.runtime.esm-bundler.js')
                },
                preserveSymlinks: false
            },
        },

        router: {
            options: {linkExactActiveClass: "active"},
        },

        routeRules: {
            "/*": {cors: true},
        },

        compatibilityDate: "2024-08-06"
    }
);