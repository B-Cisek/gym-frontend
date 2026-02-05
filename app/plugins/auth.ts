export default defineNuxtPlugin(() => {
  const event = useRequestEvent();
  const { user } = useAuth();

  if (event?.context?.user) {
    user.value = event.context.user;
  }
});
