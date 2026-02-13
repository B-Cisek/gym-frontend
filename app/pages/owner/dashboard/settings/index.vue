<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const profileSchema = z.object({
  firstName: z
    .string("To pole jest wymagane")
    .max(100, "Maxymalna długość to 100 znaków"),
  lastName: z
    .string("To pole jest wymagane")
    .max(100, "Maxymalna długość to 100 znaków"),
  email: z.email("Niepoprawny adres email"),
  phone: z
    .string("To pole jest wymagane")
    .length(9, "Niepoprawny numer telefonu"),
});

type ProfileSchema = z.output<typeof profileSchema>;

const ownerSettings = useOwnerSettings();
const toast = useToast();

const profile = reactive<Partial<ProfileSchema>>({
  firstName: ownerSettings.settings.firstName,
  lastName: ownerSettings.settings.lastName,
  email: ownerSettings.settings.email,
  phone: ownerSettings.settings.phone,
});

async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
  try {
    await ownerSettings.updateProfile(event.data);
    toast.add({
      title: "Success",
      description: "Profil został zaktualizowany.",
      icon: "i-lucide-check",
      color: "success",
    });
  } catch {
    toast.add({
      title: "Błąd",
      description: "Nie udało się zapisać zmian.",
      icon: "i-lucide-x",
      color: "error",
    });
  }
}
</script>

<template>
  <UForm
    id="settings"
    :schema="profileSchema"
    :state="profile"
    @submit="onSubmit"
  >
    <UPageCard
      title="Profil"
      description="Informacje o profilu."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        form="settings"
        label="Zapisz"
        color="neutral"
        type="submit"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        name="firstName"
        label="Imię"
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput v-model="profile.firstName" autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField
        name="lastName"
        label="Nazwisko"
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput v-model="profile.lastName" autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField
        name="email"
        label="Email"
        description="Email do komunikacji, jeżeli nie podano zostanie użyty email, który był podany podczas rejestracji."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.email"
          type="email"
          autocomplete="off"
          class="w-53"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="phone"
        label="Telefon"
        description="Numer kontaktowy."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <PhoneInput v-model="profile.phone" class="w-53" />
      </UFormField>
    </UPageCard>
  </UForm>
</template>
