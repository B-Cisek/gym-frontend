<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Gym } from "~/types";

const isManageGymsOpen = defineModel<boolean>();

const { get, del } = useApi();
const toast = useAppToast();
const gymContext = useGymContext();

// TODO: refactor to store
const { data, pending, execute } = useAsyncData<{ gyms: Gym[] }>(
  "gyms",
  () => get("/gyms"),
  {
    server: false,
    immediate: false,
  },
);

async function deleteGym(gym: Gym) {
  const confirm = useConfirmModal();

  if (gymContext.selectedGym?.id === gym.id) {
    toast.error("Nie można usunąć siłownia, która jest aktualnie wybrana");
    return;
  }

  const confirmed = await confirm({
    title: "Usuń siłownię",
    description: `Czy na pewno chcesz usunąć "${gym.name}"?`,
  });

  if (confirmed) {
    try {
      await del(`/gyms/${gym.id}`);
      await execute();
      toast.success(`Siłowna "${gym.name}" została usunięta`);
    } catch {
      toast.error("Wystąpił błąd");
    }
  }
}

const formatAddress = (gym: Gym): string => {
  const { street, city, postalCode } = gym;
  if (!street && !city && !postalCode) return "brak";

  const lines: string[] = [];
  if (street) lines.push(street);
  const cityLine = [postalCode, city].filter(Boolean).join(" ");
  if (cityLine) lines.push(cityLine);
  return lines.join("\n");
};

const isAddGymOpen = ref(false);
const gymToEdit = ref<Gym | undefined>(undefined);

function openEditModal(gym: Gym) {
  gymToEdit.value = gym;
  isAddGymOpen.value = true;
}

function gymActions(gym: Gym): DropdownMenuItem[][] {
  return [
    [
      {
        label: "Edytuj",
        icon: "i-lucide-pencil",
        onSelect: () => openEditModal(gym),
      },
    ],
    [
      {
        label: "Usuń",
        icon: "i-lucide-trash-2",
        color: "error",
        onSelect: async () => {
          await deleteGym(gym);
        },
      },
    ],
  ];
}

watch(isManageGymsOpen, (val) => {
  if (val) execute();
});

watch(isAddGymOpen, (val, oldVal) => {
  if (!val && oldVal) {
    gymToEdit.value = undefined;
    execute();
  }
});
</script>

<template>
  <USlideover
    v-model:open="isManageGymsOpen"
    title="Lista siłowni"
    side="left"
    description="Zarządzaj siłowniami"
  >
    <template #body>
      <div v-if="pending" class="flex justify-center py-12">
        <UIcon
          name="i-lucide-loader-circle"
          class="animate-spin text-2xl text-dimmed"
        />
      </div>

      <div
        v-else-if="data?.gyms?.length === 0"
        class="py-8 text-center text-sm text-dimmed"
      >
        Dodaj pierwszą siłownie, aby rozpocząć.
      </div>

      <div v-else class="flex flex-col gap-2">
        <div
          v-for="gym in data?.gyms"
          :key="gym.id"
          class="flex items-center justify-between rounded-lg border border-default p-3"
        >
          <div class="flex flex-col gap-0.5">
            <span class="font-medium">{{ gym.name }}</span>
            <span class="flex items-start gap-1.5 text-sm text-dimmed">
              <UIcon name="i-lucide-map-pin" class="mt-0.5 shrink-0" />
              <span class="whitespace-pre-line">{{ formatAddress(gym) }}</span>
            </span>
          </div>
          <UDropdownMenu :items="gymActions(gym)" :modal="false">
            <UButton
              icon="i-lucide-ellipsis"
              color="neutral"
              variant="ghost"
              size="sm"
            />
          </UDropdownMenu>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        label="Dodaj siłownię"
        icon="i-lucide-circle-plus"
        block
        @click="isAddGymOpen = true"
      />
    </template>
  </USlideover>

  <GymModal v-model="isAddGymOpen" :gym="gymToEdit" />
</template>
