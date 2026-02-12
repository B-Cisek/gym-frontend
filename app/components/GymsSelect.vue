<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { GymMenu } from "~/types";

defineProps<{ collapsed?: boolean }>();

const gymContext = useGymContext();

const isAddGymOpen = ref(false);
const isManageGymsOpen = ref(false);

const items = computed<DropdownMenuItem[][]>(() => [
  gymContext.gyms.map((gym: GymMenu) => ({
    label: gym.name,
    onSelect() {
      gymContext.setGym(gym);
    },
  })),
  [
    {
      label: "Dodaj siłownie",
      icon: "i-lucide-circle-plus",
      onSelect() {
        isAddGymOpen.value = true;
      },
    },
    {
      label: "Zarządzaj siłowniami",
      icon: "i-lucide-cog",
      onSelect() {
        isManageGymsOpen.value = true;
      },
    },
  ],
]);
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{
      content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)',
    }"
  >
    <UButton
      :label="
        collapsed
          ? undefined
          : (gymContext.selectedGym?.name ?? 'Wybierz siłownię')
      "
      :trailing-icon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :class="[!collapsed && 'py-2']"
      :ui="{ trailingIcon: 'text-dimmed' }"
    />
  </UDropdownMenu>

  <GymModal v-model="isAddGymOpen" />
  <GymsManage v-model="isManageGymsOpen" />
</template>
