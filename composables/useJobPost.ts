export function useJobPost() {
  const userStore = useUserStore();


  const jobPostCtaLabel = computed(() => `Post your Job for for ${userStore.myCompany?.hasFreeJobPosts ? 'free' : '20$'}`);


  return {
    jobPostCtaLabel,
  };
}