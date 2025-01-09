import {storeToRefs} from "pinia";

export function useUser() {
    const authStore = useAuthStore();

    const {isUserFetched, authUser} = storeToRefs(authStore);

    const getUser = async () => {
        await authStore.getUser();

        if (isUserFetched.value) {
            await useAnalytics().identifyUser(authUser.value);
        }
    };

    return {
        getUser,
    };
}
