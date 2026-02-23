<script setup lang="ts">
definePageMeta({ layout: false });
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center flex flex-col items-center gap-6 max-w-md">
      <UIcon name="i-lucide-circle-check" class="size-16 text-success" />
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-bold">Subskrypcja aktywowana!</h1>
        <p class="text-muted">
          Twoja subskrypcja została pomyślnie aktywowana. Możesz teraz korzystać
          z wszystkich funkcji swojego planu.
        </p>
      </div>
      <UButton to="/owner/dashboard" label="Przejdź do panelu" size="lg" />
    </div>
  </div>
</template>
