<script setup lang="ts">
import { PlanTier, type Plan, type PlanPrice } from "~/types";

const isOpen = defineModel<boolean>();

const subscriptionStore = useSubscription();
const plansStore = usePlans();

callOnce("fetch-plans", async () => {
  if (plansStore.plans.length === 0) {
    await plansStore.fetchPlans();
  }
});

function formatAmount(price: PlanPrice): string {
  return `${(price.amount / 100).toLocaleString("pl-PL")} zł`;
}

function getTierDescription(tier: PlanTier): string {
  switch (tier) {
    case PlanTier.BASIC:
      return "Dla małych siłowni.";
    case PlanTier.PRO:
      return "Dla rozwijających się sieci siłowni.";
    case PlanTier.UNLIMITED:
      return "Pełna swoboda bez żadnych ograniczeń.";
    default:
      return "";
  }
}

function getPlanFeatures(plan: Plan): string[] {
  return [
    plan.gymsLimit === 0
      ? "Nieograniczona liczba siłowni"
      : `Do ${plan.gymsLimit} siłowni`,
    plan.staffLimit === 0
      ? "Nieograniczona liczba pracowników"
      : `Do ${plan.staffLimit} pracowników`,
  ];
}

const plans = computed(() =>
  plansStore.plans.map((plan: Plan) => {
    const monthlyPrice = plan.prices.find(
      (p: PlanPrice) => p.interval === "month",
    );

    return {
      id: plan.id,
      tier: plan.tier,
      title: plan.tier.charAt(0).toUpperCase() + plan.tier.slice(1),
      description: getTierDescription(plan.tier),
      features: getPlanFeatures(plan),
      price: monthlyPrice ? formatAmount(monthlyPrice) : "N/A",
      priceId: monthlyPrice?.id,
    };
  }),
);

async function selectPlan(plan: (typeof plans.value)[number]) {
  const priceId = plan.priceId;

  if (!priceId) return;

  const url = await subscriptionStore.createCheckoutSession(priceId);
  await navigateTo(url, { external: true });
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Wybierz plan subskrypcji"
    description="Wybierz plan odpowiedni dla Twojej siłowni."
    :ui="{ content: 'sm:max-w-4xl' }"
  >
    <template #body>
      <div class="flex flex-col items-center gap-8 py-4">
        <UPricingPlans scale>
          <UPricingPlan
            v-for="plan in plans"
            :key="plan.id"
            :title="plan.title"
            :description="plan.description"
            :features="plan.features"
            :button="{
              label: 'Wybierz plan',
              onClick: () => selectPlan(plan),
            }"
            :price="plan.price"
            billing-cycle="/miesiąc"
          />
        </UPricingPlans>
      </div>
    </template>
  </UModal>
</template>
