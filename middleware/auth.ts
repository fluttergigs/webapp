import { useAuthStore } from '~/stores/auth';
import { AppRoutes } from '~/core/routes';

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, setReturnUrl } = useAuthStore();

  if (!isAuthenticated) {
    setReturnUrl(to.fullPath);
    return navigateTo(AppRoutes.login);
  }
});