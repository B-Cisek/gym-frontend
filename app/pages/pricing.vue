<script setup lang="ts">
import type { Plan, PlanPrice } from "~/types";

const { data: page } = await useAsyncData("pricing", () =>
  queryCollection("pricing").first(),
);

const { data: plansData } = await useAsyncData(
  "plans",
  () => {
    const { apiBaseUrl } = useRuntimeConfig().public;
    return $fetch<{ plans: Plan[] }>(`${apiBaseUrl}/plans`);
  },
  { lazy: true },
);

const title = page.value?.seo?.title || page.value?.title;
const description = page.value?.seo?.description || page.value?.description;

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});

const isYearly = ref("0");

const tabs = [
  { label: "Miesięcznie", value: "0" },
  { label: "Rocznie", value: "1" },
];

function formatAmount(price: PlanPrice | undefined): string | null {
  if (!price) return null;
  return `${(price.amount / 100).toLocaleString("pl-PL")} zł`;
}

function getTierDescription(tier: string): string {
  switch (tier) {
    case "basic":
      return "Idealny dla małych siłowni stawiających pierwsze kroki.";
    case "pro":
      return "Dla rozwijających się sieci siłowni.";
    case "unlimited":
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
  (plansData.value?.plans ?? []).map((plan) => ({
    id: plan.id,
    title: plan.tier.charAt(0).toUpperCase() + plan.tier.slice(1),
    description: getTierDescription(plan.tier),
    features: getPlanFeatures(plan),
    highlight: plan.tier === "pro",
    scale: plan.tier === "pro",
    button:
      plan.tier === "pro"
        ? { label: "Wybierz plan" }
        : { label: "Wybierz plan", color: "neutral", variant: "subtle" },
    monthlyPrice: formatAmount(plan.prices.find((p) => p.interval === "month")),
    yearlyPrice: formatAmount(plan.prices.find((p) => p.interval === "year")),
  })),
);

const hasYearlyPrices = computed(
  () =>
    plansData.value?.plans.some((p) =>
      p.prices.some((price) => price.interval === "year"),
    ) ?? false,
);
</script>

<template>
  <div v-if="page">
    <UPageHero :title="page.title" :description="page.description">
      <template v-if="hasYearlyPrices" #links>
        <UTabs
          v-model="isYearly"
          :items="tabs"
          color="neutral"
          size="xs"
          class="w-48"
          :ui="{
            list: 'ring ring-accented rounded-full',
            indicator: 'rounded-full',
            trigger: 'w-1/2',
          }"
        />
      </template>
    </UPageHero>

    <UContainer>
      <UPricingPlans scale>
        <UPricingPlan
          v-for="plan in plans"
          :key="plan.id"
          :title="plan.title"
          :description="plan.description"
          :features="plan.features"
          :highlight="plan.highlight"
          :scale="plan.scale"
          :button="plan.button"
          :price="
            isYearly === '1' && plan.yearlyPrice
              ? plan.yearlyPrice
              : plan.monthlyPrice
          "
          :billing-cycle="
            isYearly === '1' && plan.yearlyPrice ? '/rok' : '/miesiąc'
          "
        />
      </UPricingPlans>
    </UContainer>

    <UPageSection>
      <UPageLogos>
        <UIcon
          v-for="icon in page.logos.icons"
          :key="icon"
          :name="icon"
          class="w-12 h-12 flex-shrink-0 text-muted"
        />
      </UPageLogos>
    </UPageSection>

    <UPageSection :title="page.faq.title" :description="page.faq.description">
      <UAccordion
        :items="page.faq.items"
        :unmount-on-hide="false"
        :default-value="['0']"
        type="multiple"
        class="max-w-3xl mx-auto"
        :ui="{
          trigger: 'text-base text-highlighted',
          body: 'text-base text-muted',
        }"
      />
    </UPageSection>
  </div>
</template>
