import { AppRoutes } from '~/core/routes';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, setReturnUrl } = useAuthStore();

  if (!isAuthenticated) {
    setReturnUrl(to.fullPath);
    return navigateTo(AppRoutes.login);
  }
});
