import type { Plan } from "~/types";

export const usePlans = defineStore("plans", () => {
  const { get } = useApi();

  const plans = ref<Plan[]>([]);

  const fetchPlans = async () => {
    const { plans: data } = await get<{ plans: Plan[] }>("/plans");
    plans.value = data;
  };

  return {
    plans,
    fetchPlans,
  };
});
