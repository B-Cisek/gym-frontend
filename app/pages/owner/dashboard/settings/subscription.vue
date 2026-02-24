<script setup lang="ts">
import { SubscriptionStatus } from "~/types";

const subscriptionStore = useSubscription();
const { subscription } = storeToRefs(subscriptionStore);

callOnce(async () => subscriptionStore.fetchSubscription, {
  mode: "navigation",
});

const dateFormater = (date: string) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const isPlansModalOpen = ref<boolean>(false);

const manageSubscription = async () => {
  const url = await subscriptionStore.openPortal();
  await navigateTo(url, { external: true });
};

const formatTier = (tier: string) => {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
};
</script>

<template>
  <div>
    <UPageCard
      title="Subskrypcja"
      description="Zarządzaj swoją subskrypcją i płatnościami."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        v-if="subscription?.status === SubscriptionStatus.ACTIVE"
        label="Zarządzaj subskrypcją"
        icon="i-lucide-external-link"
        trailing
        class="w-fit lg:ms-auto"
        @click="manageSubscription"
      />
    </UPageCard>

    <!-- Active -->
    <UPageCard
      v-if="subscription?.status === SubscriptionStatus.ACTIVE"
      variant="subtle"
    >
      <div class="flex max-sm:flex-col justify-between items-start gap-4">
        <span class="text-sm font-medium text-highlighted">Status</span>
        <UBadge color="success" label="Aktywna" />
      </div>
      <USeparator />
      <div class="flex max-sm:flex-col justify-between items-start gap-4">
        <span class="text-sm font-medium text-highlighted">Plan</span>
        <span class="text-sm">{{ formatTier(subscription.tier) }}</span>
      </div>
      <USeparator />
      <template v-if="subscription?.cancelTime">
        <div class="flex max-sm:flex-col justify-between items-start gap-4">
          <span class="text-sm font-medium text-highlighted">Anulowana</span>
          <span class="text-sm">{{
            dateFormater(subscription.cancelTime)
          }}</span>
        </div>
        <USeparator />
        <div class="flex max-sm:flex-col justify-between items-start gap-4">
          <span class="text-sm font-medium text-highlighted"
            >Koniec dostępu</span
          >
          <span class="text-sm">{{ dateFormater(subscription.endTime) }}</span>
        </div>
      </template>
      <template v-else>
        <div class="flex max-sm:flex-col justify-between items-start gap-4">
          <span class="text-sm font-medium text-highlighted">Odnowienie</span>
          <span class="text-sm">{{ dateFormater(subscription.endTime) }}</span>
        </div>
      </template>
    </UPageCard>

    <!-- Expired -->
    <UPageCard
      v-else-if="subscription?.status === SubscriptionStatus.INCOMPLETE_EXPIRED"
      variant="subtle"
    >
      <div class="flex max-sm:flex-col justify-between items-start gap-4">
        <span class="text-sm font-medium text-highlighted">Status</span>
        <UBadge color="error" label="Wygasła" />
      </div>
      <USeparator />
      <div class="flex max-sm:flex-col justify-between items-start gap-4">
        <span class="text-sm font-medium text-highlighted">Plan</span>
        <span class="text-sm">{{ formatTier(subscription.tier) }}</span>
      </div>
      <USeparator />
      <div class="flex max-sm:flex-col justify-between items-start gap-4">
        <span class="text-sm font-medium text-highlighted">Wygasła</span>
        <span class="text-sm">{{ dateFormater(subscription.endTime) }}</span>
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
        <UIcon name="i-lucide-credit-card" class="size-8 text-muted" />
        <p class="text-sm text-muted">Nie masz jeszcze aktywnej subskrypcji.</p>
        <UButton
          label="Wybierz plan"
          color="primary"
          @click="isPlansModalOpen = true"
        />
      </div>
    </UPageCard>

    <SubscriptionPlansModal v-model="isPlansModalOpen" />
  </div>
</template>
