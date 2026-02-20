export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith("/owner/dashboard")) return;

  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn.value || !user.value) return;

  if (!user.value.isProfileComplete) {
    return navigateTo("/owner/setup");
  }
});
