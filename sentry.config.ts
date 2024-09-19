import * as Sentry from "@sentry/nuxt";

Sentry.init({
    dsn: "https://f75947c9ff3f5ec880cb5f644cf74f85@o4507778789867520.ingest.de.sentry.io/4507806697586768",

    environment: process.env.NODE_ENV,
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    integrations: [
        // Add browser profiling integration to the list of integrations
        Sentry.browserTracingIntegration(),
        Sentry.browserProfilingIntegration(),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for tracing.
    // We recommend adjusting this value in production
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
    // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/fluttergigs\.com\//],

    // Set profilesSampleRate to 1.0 to profile every transaction.
    // Since profilesSampleRate is relative to tracesSampleRate,
    // the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
    // For example, a tracesSampleRate of 0.5 and profilesSampleRate of 0.5 would
    // results in 25% of transactions being profiled (0.5*0.5=0.25)
    profilesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,

});
