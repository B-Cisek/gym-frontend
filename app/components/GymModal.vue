<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Gym } from "~/types";

const props = defineProps<{
  gym?: Gym;
  forced?: boolean;
}>();

const toast = useAppToast();
const { post, put } = useApi();
const gymContext = useGymContext();

const isOpen = defineModel<boolean>();

const isEditMode = computed(() => !!props.gym);

const loading = ref<boolean>(false);

const schema = z.object({
  name: z.string("Nazwa jest wymagana").min(2).max(255),
  street: z.string().max(255).optional(),
  city: z.string().max(20).optional(),
  postalCode: z
    .string()
    .regex(/^\d{2}-\d{3}$/, "Format: XX-XXX")
    .max(6)
    .optional(),
});

type Schema = z.output<typeof schema>;

const initialState = (): Partial<Schema> => ({
  name: props.gym?.name,
  street: props.gym?.street,
  city: props.gym?.city,
  postalCode: props.gym?.postalCode,
});

const state = reactive<Partial<Schema>>(initialState());

watch(
  () => props.gym,
  () => Object.assign(state, initialState()),
);

function resetForm() {
  Object.assign(state, initialState());
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true;

    if (isEditMode.value) {
      await put(`/gyms/${props.gym!.id}`, event.data);
      toast.success("Siłownia została zaktualizowana.");
    } else {
      await post("/gyms", event.data);
      toast.success("Siłownia została dodana.");
    }

    await gymContext.fetchGyms();
    resetForm();
    isOpen.value = false;
  } catch {
    toast.error("Wystąpił błąd, spróbuj ponownie.");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="
      forced
        ? 'Dodaj swoją pierwszą siłownię'
        : isEditMode
          ? 'Edytuj siłownię'
          : 'Tworzenie siłowni'
    "
    :description="
      forced
        ? 'Aby korzystać z panelu, musisz dodać co najmniej jedną siłownię.'
        : 'Dodaj nową lokalicazje siłowni'
    "
    :close="!forced"
    :dismissible="!forced"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Nazwa" name="name" class="w-full">
          <UInput v-model="state.name" type="text" class="w-full" />
        </UFormField>

        <UFormField label="Ulica" name="street" class="w-full">
          <UInput v-model="state.street" type="text" class="w-full" />
        </UFormField>

        <UFormField label="Miasto" name="city" class="w-full">
          <UInput v-model="state.city" type="text" class="w-full" />
        </UFormField>

        <UFormField label="Kod pocztowy" name="postalCode" class="w-full">
          <PostalCodeInput v-model="state.postalCode" class="w-full" />
        </UFormField>

        <UButton type="submit" class="w-full justify-center" :loading="loading">
          {{ isEditMode ? "Zapisz zmiany" : "Dodaj siłownię" }}
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
