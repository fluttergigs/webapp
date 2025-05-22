export function useJob() {
  const userStore = useUserStore();
  const jobStore = useJobStore();

  const { filteredJobs } = storeToRefs(jobStore);

  const currentPage = ref(1);

  const paginatedJobs = computed(() => {
    const startIndex = (currentPage.value - 1) * MAX_JOBS_PER_PAGE;
    return (filteredJobs.value ?? []).slice(startIndex, startIndex + MAX_JOBS_PER_PAGE);
  });

  const totalPages = computed(() =>
    Math.ceil((filteredJobs.value ?? []).length / MAX_JOBS_PER_PAGE),
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  return {
    paginatedJobs,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
  };
}
