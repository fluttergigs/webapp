export function useFields() {
  const isPasswordVisible = ref(false);

  const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
  };

  const passwordFieldType = computed(() => isPasswordVisible.value ? 'text' : 'password');

  return {
    passwordFieldType,
    isPasswordVisible,
    togglePasswordVisibility,
  };
}