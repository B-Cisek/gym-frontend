<script setup lang="ts">
import * as z from "zod";

definePageMeta({
  middleware: ["auth", "setup-complete"],
  layout: "setup",
});

const ownerSettings = useOwnerSettings();
const gymContext = useGymContext();
const { fetchUser } = useAuth();
const { post } = useApi();
const toast = useAppToast();

const currentStep = ref(0);

const items = [
  {
    slot: "profile" as const,
    title: "Profil",
    description: "Dane osobowe",
    icon: "i-lucide-user",
  },
  {
    slot: "company" as const,
    title: "Firma",
    description: "Dane firmy",
    icon: "i-lucide-building-2",
  },
  {
    slot: "gym" as const,
    title: "Siłownia",
    description: "Pierwsza siłownia",
    icon: "i-lucide-dumbbell",
  },
] satisfies StepperItem[];

// Profile step
const profileSchema = z.object({
  firstName: z
    .string("To pole jest wymagane")
    .min(1, "To pole jest wymagane")
    .max(100, "Maxymalna długość to 100 znaków"),
  lastName: z
    .string("To pole jest wymagane")
    .min(1, "To pole jest wymagane")
    .max(100, "Maxymalna długość to 100 znaków"),
  phone: z
    .string("To pole jest wymagane")
    .length(9, "Niepoprawny numer telefonu"),
  email: z.email("Niepoprawny adres email"),
});

type ProfileSchema = z.output<typeof profileSchema>;

const { user } = useAuth();

const profile = reactive<Partial<ProfileSchema>>({
  email: user.value?.email,
});

const profileLoading = ref(false);

async function onProfileSubmit(event: FormSubmitEvent<ProfileSchema>) {
  try {
    profileLoading.value = true;
    await ownerSettings.updateProfile(event.data);
    currentStep.value++;
  } catch {
    toast.error("Nie udało się zapisać profilu.");
  } finally {
    profileLoading.value = false;
  }
}

// Company step
const companySchema = z.object({
  companyName: z
    .string("To pole jest wymagane")
    .min(1, "To pole jest wymagane")
    .max(255, "Nazwa firmy jest za długa"),
  taxId: z
    .string("To pole jest wymagane")
    .regex(/^\d{10}$/, "Niepoprawny numer NIP"),
  street: z
    .string("To pole jest wymagane")
    .min(1, "To pole jest wymagane")
    .max(100, "Adres jest za długi"),
  postalCode: z
    .string("To pole jest wymagane")
    .regex(/^\d{2}-\d{3}$/, "Niepoprawny kod pocztowy"),
  city: z
    .string("To pole jest wymagane")
    .min(1, "To pole jest wymagane")
    .max(100, "Miasto jest za długie"),
});

type CompanySchema = z.output<typeof companySchema>;

const company = reactive<Partial<CompanySchema>>({});

const companyLoading = ref(false);

async function onCompanySubmit(event: FormSubmitEvent<CompanySchema>) {
  try {
    companyLoading.value = true;
    await ownerSettings.updateCompany(event.data);
    currentStep.value++;
  } catch {
    toast.error("Nie udało się zapisać danych firmy.");
  } finally {
    companyLoading.value = false;
  }
}

// Gym step
const gymSchema = z.object({
  name: z.string("Nazwa jest wymagana").min(2).max(255),
  street: z.string().max(255).optional(),
  city: z.string().max(20).optional(),
  postalCode: z
    .string()
    .regex(/^\d{2}-\d{3}$/, "Format: XX-XXX")
    .max(6)
    .optional(),
});

type GymSchema = z.output<typeof gymSchema>;

const gym = reactive<Partial<GymSchema>>({});

const gymLoading = ref(false);

async function onGymSubmit(event: FormSubmitEvent<GymSchema>) {
  try {
    gymLoading.value = true;
    await post("/gyms", event.data);
    await gymContext.fetchGyms();
    await post("/complete-setup");
    await fetchUser();
    await navigateTo("/owner/dashboard");
  } catch {
    toast.error("Nie udało się dodać siłowni.");
  } finally {
    gymLoading.value = false;
  }
}
</script>

<template>
  <UStepper v-model="currentStep" :items="items" disabled class="w-full">
    <template #profile>
      <UForm
        :schema="profileSchema"
        :state="profile"
        class="space-y-4 mt-6"
        @submit="onProfileSubmit"
      >
        <UPageCard variant="subtle">
          <UFormField name="firstName" label="Imię" required>
            <UInput
              v-model="profile.firstName"
              autocomplete="off"
              class="w-full"
            />
          </UFormField>
          <USeparator />
          <UFormField name="lastName" label="Nazwisko" required>
            <UInput
              v-model="profile.lastName"
              autocomplete="off"
              class="w-full"
            />
          </UFormField>
          <USeparator />
          <UFormField
            name="email"
            label="Email"
            description="Możesz podać inny adres — będzie używany do komunikacji z Tobą."
          >
            <UInput
              v-model="profile.email"
              type="email"
              autocomplete="off"
              class="w-full"
            />
          </UFormField>
          <USeparator />
          <UFormField name="phone" label="Telefon" required>
            <PhoneInput v-model="profile.phone" class="w-full" />
          </UFormField>
        </UPageCard>

        <div class="flex justify-end">
          <UButton type="submit" :loading="profileLoading" color="neutral">
            Dalej
          </UButton>
        </div>
      </UForm>
    </template>

    <template #company>
      <UForm
        :schema="companySchema"
        :state="company"
        class="space-y-4 mt-6"
        @submit="onCompanySubmit"
      >
        <UPageCard variant="subtle">
          <UFormField name="companyName" label="Nazwa firmy" required>
            <UInput
              v-model="company.companyName"
              autocomplete="off"
              class="w-full"
            />
          </UFormField>
          <USeparator />
          <UFormField name="taxId" label="NIP" required>
            <UInput v-model="company.taxId" autocomplete="off" class="w-full" />
          </UFormField>
          <USeparator />
          <UFormField name="street" label="Ulica" required>
            <UInput
              v-model="company.street"
              autocomplete="off"
              class="w-full"
            />
          </UFormField>
          <USeparator />
          <UFormField name="postalCode" label="Kod pocztowy" required>
            <PostalCodeInput v-model="company.postalCode" class="w-full" />
          </UFormField>
          <USeparator />
          <UFormField name="city" label="Miasto" required>
            <UInput v-model="company.city" autocomplete="off" class="w-full" />
          </UFormField>
        </UPageCard>

        <div class="flex justify-between">
          <UButton variant="ghost" color="neutral" @click="currentStep--">
            Wstecz
          </UButton>
          <UButton type="submit" :loading="companyLoading" color="neutral">
            Dalej
          </UButton>
        </div>
      </UForm>
    </template>

    <template #gym>
      <UForm
        :schema="gymSchema"
        :state="gym"
        class="space-y-4 mt-6"
        @submit="onGymSubmit"
      >
        <UPageCard variant="subtle">
          <UFormField name="name" label="Nazwa" required>
            <UInput v-model="gym.name" type="text" class="w-full" />
          </UFormField>
          <USeparator />
          <UFormField name="street" label="Ulica">
            <UInput v-model="gym.street" type="text" class="w-full" />
          </UFormField>
          <USeparator />
          <UFormField name="city" label="Miasto">
            <UInput v-model="gym.city" type="text" class="w-full" />
          </UFormField>
          <USeparator />
          <UFormField name="postalCode" label="Kod pocztowy">
            <PostalCodeInput v-model="gym.postalCode" class="w-full" />
          </UFormField>
        </UPageCard>

        <div class="flex justify-between">
          <UButton variant="ghost" color="neutral" @click="currentStep--">
            Wstecz
          </UButton>
          <UButton type="submit" :loading="gymLoading" color="neutral">
            Zakończ
          </UButton>
        </div>
      </UForm>
    </template>
  </UStepper>
</template>
