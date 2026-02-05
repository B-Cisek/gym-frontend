<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { AuthError } from "~/types";

definePageMeta({
  layout: "auth",
  middleware: "guest",
});

useSeoMeta({
  title: "Logowanie",
  description: "Zaloguj się do swojego konta.",
});

const toast = useAppToast();
const auth = useAuth();

const errorMessage = ref<string>("");

const fields = [
  {
    name: "email",
    type: "text" as const,
    label: "Email",
    placeholder: "Podaj swój email",
    required: true,
  },
  {
    name: "password",
    label: "Hasło",
    type: "password" as const,
    placeholder: "Podaj swoje hasło",
    required: true,
  },
];

const schema = z.object({
  email: z.email("Nieprawidłowy adres email"),
  password: z.string({ error: "Hasło jest wymagane" }),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    await auth.signIn(payload.data);
    toast.success("Zalogowano pomyślnie");
    await navigateTo("/owner/dashboard");
  } catch (error) {
    errorMessage.value = "Nie udało się zalogować. Spróbuj ponownie.";

    if (error instanceof AuthError) {
      errorMessage.value = error.message;
    }

    toast.error(errorMessage.value);
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    title="Zaloguj się do swojego konta"
    icon="i-lucide-lock"
    :submit="{
      label: 'Zaloguj się',
      class: 'cursor-pointer',
      loading: auth.loading.value,
    }"
    @submit="onSubmit"
  >
    <template #validation>
      <UAlert
        v-show="errorMessage !== ''"
        color="error"
        icon="i-lucide-info"
        :title="errorMessage"
      />
    </template>
    <template #description>
      Nie masz konta?
      <ULink to="/signup" class="text-primary font-medium"
        >Zarejestruj się</ULink
      >.
    </template>

    <template #password-hint>
      <ULink to="/" class="text-primary font-medium" tabindex="-1"
        >Zapomniałeś hasła?</ULink
      >
    </template>

    <template #footer>
      Logując się, akceptujesz nasze warunki korzystania z serwisu
      <br />
      <ULink to="/" class="text-primary font-medium">Terms of Service</ULink>.
    </template>
  </UAuthForm>
</template>
