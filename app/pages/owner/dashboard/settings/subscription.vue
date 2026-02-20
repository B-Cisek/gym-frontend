<script setup lang="ts">
import type { Subscription } from "~/types";

const subscriptionStore = useSubscription();

const subscription = ref<Subscription>({
  status: "active",
  planName: "Pro",
  currentPeriodEnd: "2026-03-16T00:00:00Z",
});

const formattedDate = computed(() => {
  if (!subscription.value.currentPeriodEnd) return "";
  return new Date(subscription.value.currentPeriodEnd).toLocaleDateString(
    "pl-PL",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
});

const manageSubscription = async () => {
  const url = await subscriptionStore.openPortal();
  await navigateTo(url, { external: true });
};
</script>

<template>
  <UPageCard
    title="Subskrypcja"
    description="Zarządzaj swoją subskrypcją i płatnościami."
    variant="naked"
    orientation="horizontal"
    class="mb-4"
  />

  <!-- Active -->
  <UPageCard v-if="subscription.status === 'active'" variant="subtle">
    <div class="flex max-sm:flex-col justify-between items-start gap-4">
      <span class="text-sm font-medium text-(--ui-text-highlighted)"
        >Status</span
      >
      <UBadge color="success" label="Aktywna" />
    </div>
    <USeparator />
    <div class="flex max-sm:flex-col justify-between items-start gap-4">
      <span class="text-sm font-medium text-(--ui-text-highlighted)">Plan</span>
      <span class="text-sm">{{ subscription.planName }}</span>
    </div>
    <USeparator />
    <div class="flex max-sm:flex-col justify-between items-start gap-4">
      <span class="text-sm font-medium text-(--ui-text-highlighted)"
        >Odnowienie</span
      >
      <span class="text-sm">{{ formattedDate }}</span>
    </div>

    <template #footer>
      <UButton
        @click="manageSubscription"
        label="Zarządzaj subskrypcją"
        icon="i-lucide-external-link"
        trailing
        class="w-fit lg:ms-auto"
      />
    </template>
  </UPageCard>

  <!-- Expired -->
  <UPageCard v-else-if="subscription.status === 'expired'" variant="subtle">
    <div class="flex max-sm:flex-col justify-between items-start gap-4">
      <span class="text-sm font-medium text-(--ui-text-highlighted)"
        >Status</span
      >
      <UBadge color="error" label="Wygasła" />
    </div>
    <USeparator />
    <div class="flex max-sm:flex-col justify-between items-start gap-4">
      <span class="text-sm font-medium text-(--ui-text-highlighted)">Plan</span>
      <span class="text-sm">{{ subscription.planName }}</span>
    </div>
    <USeparator />
    <div class="flex max-sm:flex-col justify-between items-start gap-4">
      <span class="text-sm font-medium text-(--ui-text-highlighted)"
        >Wygasła</span
      >
      <span class="text-sm">{{ formattedDate }}</span>
    </div>

    <template #footer>
      <UButton
        label="Odnów subskrypcję"
        color="primary"
        class="w-fit lg:ms-auto"
      />
    </template>
  </UPageCard>

  <!-- None -->
  <UPageCard v-else variant="subtle">
    <div class="flex flex-col items-center gap-4 py-6">
      <UIcon
        name="i-lucide-credit-card"
        class="size-8 text-(--ui-text-muted)"
      />
      <p class="text-sm text-(--ui-text-muted)">
        Nie masz jeszcze aktywnej subskrypcji.
      </p>
      <UButton label="Wybierz plan" color="primary" />
    </div>
  </UPageCard>
</template>
