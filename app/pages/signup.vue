<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { AuthError } from "~/types";

definePageMeta({
  layout: "auth",
  middleware: ["guest"],
});

useSeoMeta({
  title: "Zarejestruj się",
  description: "Utwórz nowe konto",
});

const toast = useAppToast();
const auth = useAuth();

const fields = [
  {
    name: "email",
    type: "text" as const,
    label: "Email",
    placeholder: "Wpisz swój email",
  },
  {
    name: "password",
    label: "Hasło",
    type: "password" as const,
    placeholder: "Wpisz swoje hasło",
  },
  {
    name: "confirmPassword",
    label: "Potwierdź hasło",
    type: "password" as const,
    placeholder: "Potwierdź swoje hasło",
  },
];

const schema = z
  .object({
    email: z.email("Nieprawidłowy adres email"),
    password: z
      .string({ error: "Hasło musi mieć co najmniej 8 znaków" })
      .min(8, "Hasło musi mieć co najmniej 8 znaków"),
    confirmPassword: z.string({ error: "Potwierdź swoje hasło" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są takie same",
    path: ["confirmPassword"],
  });

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    await auth.signUpOwner({
      email: payload.data.email,
      password: payload.data.password,
    });

    toast.success("Konto zostało utworzone pomyślnie");
    await navigateTo("/dashboard");
  } catch (error) {
    let message = "Wystąpił błąd podczas tworzenia konta";

    if (error instanceof AuthError) {
      message = error.message;
    }

    toast.error(message);
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    title="Zarejestruj się"
    :submit="{
      label: 'Zarejestruj się',
      class: 'cursor-pointer',
      loading: auth.loading.value,
    }"
    @submit="onSubmit"
  >
    <template #description>
      Masz już konto?
      <ULink to="/login" class="text-primary font-medium">Zaloguj się</ULink>.
    </template>

    <template #footer>
      Rejestrując się, akceptujesz nasze warunki korzystania z serwisu
      <br />
      <ULink to="/" class="text-primary font-medium">Terms of Service</ULink>.
    </template>
  </UAuthForm>
</template>
