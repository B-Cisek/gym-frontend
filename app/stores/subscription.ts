import type { Subscription } from "~/types";

export const useSubscription = defineStore("subscription", () => {
  const { post, get } = useApi();

  const subscription = ref<Subscription | null>(null);

  async function fetchSubscription() {
    const data = await get<Subscription>("/subscription");

    if (data.id) {
      subscription.value = data;
    }
  }

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

  return { createCheckoutSession, openPortal, fetchSubscription, subscription };
});
