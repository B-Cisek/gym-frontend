<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import GymsSelect from "~/components/GymsSelect.vue";

const route = useRoute();
const toast = useToast();

const gymContext = useGymContext();

const open = ref(false);

const links = [
  [
    {
      label: "Home",
      icon: "i-lucide-house",
      to: "/owner/dashboard",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Customers",
      icon: "i-lucide-users",
      to: "/owner/dashboard/customers",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Ustawienia",
      to: "/owner/dashboard/settings",
      icon: "i-lucide-settings",
      defaultOpen: true,
      type: "trigger",
      children: [
        {
          label: "Profil",
          to: "/owner/dashboard/settings",
          exact: true,
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: "Firma",
          to: "/owner/dashboard/settings/company",
          exact: true,
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: "Powiadomienia",
          to: "/owner/dashboard/settings/notifications",
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: "Bezpieczeństwo",
          to: "/owner/dashboard/settings/security",
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: "Subskrypcja",
          to: "/owner/dashboard/settings/subscription",
          exact: true,
          onSelect: () => {
            open.value = false;
          },
        },
      ],
    },
  ],
] satisfies NavigationMenuItem[][];

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: links.flat(),
  },
  {
    id: "code",
    label: "Code",
    items: [
      {
        id: "source",
        label: "View page source",
        icon: "i-simple-icons-github",
        to: `https://github.com/nuxt-ui-templates/dashboard/blob/main/app/pages${route.path === "/" ? "/index" : route.path}.vue`,
        target: "_blank",
      },
    ],
  },
]);

await callOnce(gymContext.fetchGyms);

onMounted(() => {
  const cookie = useCookie("cookie-consent");
  if (cookie.value === "accepted") {
    return;
  }

  toast.add({
    title:
      "We use first-party cookies to enhance your experience on our website.",
    duration: 0,
    close: false,
    actions: [
      {
        label: "Accept",
        color: "neutral",
        variant: "outline",
        onClick: () => {
          cookie.value = "accepted";
        },
      },
      {
        label: "Opt out",
        color: "neutral",
        variant: "ghost",
      },
    ],
  });
});
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <GymsSelect :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton
          :collapsed="collapsed"
          class="bg-transparent ring-default"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
