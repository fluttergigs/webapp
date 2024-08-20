import {ErrorTrackerProvider} from "~/services/error-tracker/error_tracker_provider";

export default defineNuxtPlugin(({vueApp}) => {
    const errorTracker = new ErrorTrackerProvider();

    return {
        provide: {
            errorTracker,
        }
    };
});