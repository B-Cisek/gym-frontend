<script setup lang="ts">
const { isLoggedIn } = useAuth();

const items = [
  {
    label: "Pricing",
    to: "/pricing",
  },
  {
    label: "Changelog",
    to: "/changelog",
  },
];
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <UColorModeButton />

      <template v-if="isLoggedIn">
        <UButton
          icon="i-lucide-layout-dashboard"
          color="neutral"
          variant="ghost"
          to="/owner/dashboard"
          class="lg:hidden"
        />

        <UButton
          label="Dashboard"
          color="neutral"
          trailing-icon="i-lucide-arrow-right"
          class="hidden lg:inline-flex"
          to="/owner/dashboard"
        />
      </template>

      <template v-else>
        <UButton
          icon="i-lucide-log-in"
          color="neutral"
          variant="ghost"
          to="/login"
          class="lg:hidden"
        />

        <UButton
          label="Sign in"
          color="neutral"
          variant="outline"
          to="/login"
          class="hidden lg:inline-flex"
        />

        <UButton
          label="Sign up"
          color="neutral"
          trailing-icon="i-lucide-arrow-right"
          class="hidden lg:inline-flex"
          to="/signup"
        />
      </template>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />

      <USeparator class="my-6" />

      <ClientOnly>
        <template v-if="isLoggedIn">
          <UButton
            label="Dashboard"
            color="neutral"
            trailing-icon="i-lucide-arrow-right"
            to="/owner/dashboard"
            block
          />
        </template>

        <template v-else>
          <UButton
            label="Sign in"
            color="neutral"
            variant="subtle"
            to="/login"
            block
            class="mb-3"
          />
          <UButton label="Sign up" color="neutral" to="/signup" block />
        </template>
      </ClientOnly>
    </template>
  </UHeader>
</template>
