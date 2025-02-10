//@ts-ignore
import path from "path";

//@ts-ignore
export default defineNuxtConfig({
    devtools: {
        enabled: true,
    },
    experimental: {
        renderJsonPayloads: false,
    },
    nitro: {
        experimental: {
            websocket: true,
        },
    },

    app: {
        keepalive: true,
    },

    // spaLoadingTemplate: false,

    colorMode: {
        preference: "light",
    },
    site: {
        name: "Flutter Gigs - The #1 Flutter jobs platform",
        url: "https://fluttergigs.com",
    },
    /*sitemap: {
        sources: ["/api/sitemap"],
    },*/
    imports: {
        dirs: [
            "core",
            "stores",
            "composables",
            "components",
            "services",
            "features",
        ],
    },
    build: {
        optimizeCSS: true,
        extractCSS: true,
        transpile: [
            "date-fns",
            // "quill-delta",
        ],
        // transpile: ['components/*', 'pages/*','composables/*'],
        //@ts-ignore
        optimization: {
            runtimeChunk: "single",
        },
    },
    ignore: ["pages/ignore/*"],

    css: [
        "~/assets/css/app.css",
        "vue-toast-notification/dist/theme-default.css",
    ],

    script: ["~/assets/js/main.js"],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    modules: [
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
        "@nuxtjs/i18n", // '@nuxtjs/tailwindcss',
        "nuxt-lodash", // 'nuxt-appwrite',
        "@nuxtjs/strapi",
        "@nuxt/ui",
        "@sentry/nuxt/module",
        "@nuxt/image",
        "nuxt-og-image"
    ],
    sentry: {
        sourceMapsUploadOptions: {
            org: "evacorp",
            project: "fluttergigs",
            authToken:
                "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",
        },
    },
    image: {
        quality: 100,
    },

    runtimeConfig: {
        public: {
            strapiEndpoint: "",
            posthogKey: "",
            posthogProjectId: "",
            apiBaseUrl: "",
            googleGenerativeApiKey: "",
            sentry: {
                dsn: "",
                environment: "",
            },
        },
    },

    strapi: {
        //@ts-ignore
        url: process.env.STRAPI_URL || "http://localhost:1337",
        prefix: "/api",
        version: "v4",
        cookie: {},
        cookieName: "strapi_jwt",
    },
    ogImage: {
        fonts: [
            // will load the Noto Sans font from Google fonts
            'Outfit:700',
            'Noto+Sans:700',
            'Work+Sans:ital:400'
        ]
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
        defaultLocale: "en",
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

        optimizeDeps: {
            include: ["quill"],
        },
        define: {
            "process.env.DEBUG": false,
        },
        // optimizeDeps: {include: ["quill", "quill-delta"]},

        resolve: {
            alias: {
                vue: path.resolve("./node_modules/vue"),
            },
            preserveSymlinks: false,
        },
    },

    router: {
        options: {linkExactActiveClass: "active"},
    },

    routeRules: {
        "/*": {
            cors: true,
        },

        /*'/api/!*': {
                                                                proxy: {
                                                                    //@ts-ignore
                                                                    target: process.env.NUXT_PUBLIC_API_BASE_URL,
                                                                    changeOrigin: true,
                                                                    rewrite: (path: any) => path.replace(/^\/api/, ''),
                                                                    secure: false,
                                                                },
                                                            },*/
    },

    compatibilityDate: "2024-08-06",
});