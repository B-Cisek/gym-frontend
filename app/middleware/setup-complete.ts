export default defineNuxtRouteMiddleware(() => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn.value || !user.value) return;

  if (user.value.isProfileComplete) {
    return navigateTo("/owner/dashboard");
  }
});
