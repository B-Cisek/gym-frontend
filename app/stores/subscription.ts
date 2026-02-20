export const useSubscription = defineStore("subscription", () => {
  const { post } = useApi();

  async function createCheckoutSession(planPriceId: string): Promise<string> {
    const { url } = await post<{ url: string }>("/subscriptions/checkout", {
      planPriceId,
    });

    return url;
  }

  async function openPortal(): Promise<string> {
    const { url } = await post<{ url: string }>("/subscriptions/portal");

    return url;
  }

  return { createCheckoutSession, openPortal };
});
