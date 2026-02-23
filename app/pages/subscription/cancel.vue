<script setup lang="ts">
definePageMeta({ layout: false });
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center flex flex-col items-center gap-6 max-w-md">
      <UIcon name="i-lucide-circle-x" class="size-16 text-error" />
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-bold">Płatność anulowana</h1>
        <p class="text-muted">
          Nie dokonano żadnej opłaty. Możesz wrócić i wybrać plan w dowolnym
          momencie.
        </p>
      </div>
      <div class="flex gap-3">
        <UButton
          to="/owner/dashboard/settings/subscription"
          label="Wróć do subskrypcji"
          size="lg"
        />
        <UButton
          to="/owner/dashboard"
          label="Panel główny"
          size="lg"
          variant="outline"
        />
      </div>
    </div>
  </div>
</template>
