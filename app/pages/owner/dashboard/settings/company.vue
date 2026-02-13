<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const companySchema = z.object({
  companyName: z
    .string("To pole jest wymagane")
    .max(255, "Nazwa firmy jest za długa"),
  taxId: z
    .string("To pole jest wymagane")
    .regex(/^\d{10}$/, "Niepoprawny numer NIP"),
  street: z.string("To pole jest wymagane").max(100, "Adres jest za długi"),
  postalCode: z
    .string("To pole jest wymagane")
    .regex(/^\d{2}-\d{3}$/, "Niepoprawny kod pocztowy"),
  city: z.string("To pole jest wymagane").max(100, "Miasto jest za długie"),
});

type CompanySchema = z.output<typeof companySchema>;

const ownerSettings = useOwnerSettings();
const toast = useAppToast();

const company = reactive<Partial<CompanySchema>>({
  companyName: ownerSettings.settings.companyName,
  taxId: ownerSettings.settings.taxId,
  street: ownerSettings.settings.street,
  postalCode: ownerSettings.settings.postalCode,
  city: ownerSettings.settings.city,
});

async function onSubmit(event: FormSubmitEvent<CompanySchema>) {
  try {
    await ownerSettings.updateCompany(event.data);
    toast.success("Dane firmy zostały zaktualizowane.");
  } catch {
    toast.error("Nie udało się zapisać zmian.");
  }
}
</script>

<template>
  <UForm
    id="company-settings"
    :schema="companySchema"
    :state="company"
    @submit="onSubmit"
  >
    <UPageCard
      title="Firma"
      description="Dane firmy."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        form="company-settings"
        label="Zapisz"
        color="neutral"
        type="submit"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        name="companyName"
        label="Nazwa firmy"
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput v-model="company.companyName" autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField
        name="taxId"
        label="NIP"
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput v-model="company.taxId" autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField
        name="street"
        label="Ulica"
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput v-model="company.street" autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField
        name="postalCode"
        label="Kod pocztowy"
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <PostalCodeInput v-model="company.postalCode" class="w-53" />
      </UFormField>
      <USeparator />
      <UFormField
        name="city"
        label="Miasto"
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput v-model="company.city" autocomplete="off" />
      </UFormField>
    </UPageCard>
  </UForm>
</template>
