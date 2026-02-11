<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

defineProps<{ collapsed?: boolean }>();

const { gyms, currentGym, loading, selectGym } = useCurrentGym();

const isAddGymOpen = ref(false);
const isManageGymsOpen = ref(false);

const items = computed<DropdownMenuItem[][]>(() => [
  gyms.value.map((gym) => ({
    label: gym.name,
    onSelect() {
      selectGym(gym);
    },
  })),
  [
    {
      label: "Add gym",
      icon: "i-lucide-circle-plus",
      onSelect() {
        isAddGymOpen.value = true;
      },
    },
    {
      label: "Manage gyms",
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
      :label="collapsed ? undefined : (currentGym?.name ?? 'Select gym')"
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

  <UModal v-model:open="isAddGymOpen" title="Add gym">
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormField>

        <UButton type="submit"> Submit </UButton>
      </UForm>
    </template>
  </UModal>

  <USlideover v-model:open="isManageGymsOpen" title="Gyms" side="left">
    <template #body>
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon
          name="i-lucide-loader-circle"
          class="animate-spin text-2xl text-dimmed"
        />
      </div>

      <div
        v-else-if="gyms.length === 0"
        class="py-8 text-center text-sm text-dimmed"
      >
        No gyms yet. Add your first gym to get started.
      </div>

      <div v-else class="flex flex-col gap-2">
        <div
          v-for="gym in gyms"
          :key="gym.id"
          class="flex items-center justify-between rounded-lg border border-default p-3"
        >
          <div class="flex flex-col gap-0.5">
            <span class="font-medium">{{ gym.name }}</span>
            <span class="flex items-center gap-1.5 text-sm text-dimmed">
              <UIcon name="i-lucide-map-pin" class="shrink-0" />
              {{ gym.address }}
            </span>
          </div>
          <UButton
            icon="i-lucide-ellipsis"
            color="neutral"
            variant="ghost"
            size="sm"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        label="Add gym"
        icon="i-lucide-circle-plus"
        block
        @click="isAddGymOpen = true"
      />
    </template>
  </USlideover>
</template>
