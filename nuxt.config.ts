export default defineNuxtConfig({
    app: {
        head: {
            title: "Flutter Gigs",
            htmlAttrs: {
                lang: "en",
            },
            meta: [
                { charset: "utf-8" },
                {
                    name: "viewport",
                    content:
                        "width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no",
                },
                { hid: "description", name: "description", content: "" },
                { name: "format-detection", content: "telephone=no" },
            ],
            link: [
                { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
                { rel: "preconnect", href: "https://fonts.gstatic.com" },
                {
                    rel: "stylesheet",
                    href: "https://fonts.cdnfonts.com/css/general-sans?styles=135312,135310,135313,135303",
                },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
                },
            ],
        },
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
        '@nuxtjs/tailwindcss',
        'nuxt-appwrite',
        '@nuxtjs/strapi'
    ],
    runtimeConfig: {
        strapiEndpoint: "",
        apiBaseUrl: "",
        authUrl: "",
        public: {
            strapiEndpoint: "",
        },
    },
    strapi: {
        url: process.env.STRAPI_URL || 'http://localhost:1337',
        prefix: '/api',
        version: 'v4',
        cookie: {},
        cookieName: 'strapi_jwt'
    },
    appwrite: {
        endpoint: process.env.NUXT_APPWRITE_ENDPOINT,
        project: process.env.NUXT_APPWRITE_PROJECT_ID,
    },
    i18n: {
        locales: [
            { code: "en", file: "en.json" },
            { code: "fr", file: "fr.json" },
        ],
        lazy: true,
        defaultLocale: "fr",
        strategy: "no_prefix",
        langDir: "locales/",
    },
    plugins: [
        { src: "~/plugins/vue3-popper", mode: "client" },
        { src: "~/plugins/perfect-scrollbar" },
        { src: "~/plugins/tippy", mode: "client" },
        { src: "~/plugins/vue3-json-excel", mode: "client" },
        { src: "~/plugins/maska", mode: "client" },
        { src: "~/plugins/vue-easymde", mode: "client" },
        { src: "~/plugins/vue3-apexcharts", mode: "client" },
        { src: "~/plugins/store" },
        { src: "~/plugins/toaster", mode: "client" },
    ],
    vite: {
        optimizeDeps: { include: ["quill"] },
    },
    router: {
        options: { linkExactActiveClass: "active" },
    },
    routeRules: {
        "/*": { cors: true },
    }
});
