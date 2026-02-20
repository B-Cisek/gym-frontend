import type { Plan } from "~/types";

export const usePlans = defineStore("plans", () => {
  const plans = ref<Plan[]>([]);

  const fetchPlans = async () => {
    const { plans: data } = await $fetch<{ plans: Plan[] }>("/plans");
    plans.value = data;
  };

  return {
    plans,
    fetchPlans,
  };
});
