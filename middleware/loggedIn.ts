import { AppRoutes } from '~/core/routes';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((from, to) => {
  const { isAuthenticated, hasReturnUrl, returnUrl } = useAuthStore();

  if (isAuthenticated) {
    return navigateTo(hasReturnUrl ? returnUrl : AppRoutes.myAccount);
  }
});
