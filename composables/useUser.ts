import { storeToRefs } from "pinia";

export function useUser() {
  const authStore = useAuthStore();

  const { isUserFetched, authUser } = storeToRefs(authStore);

  const fetchUser = async () => {
    await authStore.fetchUser();

    if (isUserFetched.value) {
      await useAnalytics().identifyUser(authUser.value);
    }
  };

  return {
    fetchUser,
  };
}
