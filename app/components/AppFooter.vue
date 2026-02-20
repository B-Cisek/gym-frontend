<script setup lang="ts">
const columns = [
  {
    label: "Zasoby",
    children: [
      {
        label: "Centrum pomocy",
      },
      {
        label: "Dokumentacja",
      },
      {
        label: "Plan rozwoju",
      },
      {
        label: "Aktualności",
        to: "/changelog",
      },
    ],
  },
  {
    label: "Funkcje",
    children: [
      {
        label: "Zarządzanie klientami",
      },
      {
        label: "Grafik zajęć",
      },
      {
        label: "Płatności online",
      },
      {
        label: "Raporty",
      },
    ],
  },
  {
    label: "Firma",
    children: [
      {
        label: "O nas",
      },
      {
        label: "Cennik",
        to: "/pricing",
      },
      {
        label: "Kariera",
      },
      {
        label: "Kontakt",
      },
    ],
  },
];

const toast = useToast();

const email = ref("");
const loading = ref(false);

function onSubmit() {
  loading.value = true;

  toast.add({
    title: "Zapisano!",
    description: "Zostałeś zapisany do naszego newslettera.",
  });
}
</script>

<template>
  <USeparator icon="i-lucide-dumbbell" class="h-px" />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <form @submit.prevent="onSubmit">
              <UFormField
                name="email"
                label="Zapisz się do newslettera"
                size="lg"
              >
                <UInput
                  v-model="email"
                  type="email"
                  class="w-full"
                  placeholder="Twój adres email"
                >
                  <template #trailing>
                    <UButton
                      type="submit"
                      size="xs"
                      color="neutral"
                      label="Zapisz się"
                    />
                  </template>
                </UInput>
              </UFormField>
            </form>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-muted text-sm">
        GymFlow © {{ new Date().getFullYear() }} – Wszelkie prawa zastrzeżone
      </p>
    </template>

    <template #right>
      <UButton
        icon="i-simple-icons-facebook"
        aria-label="GymFlow na Facebooku"
        color="neutral"
        variant="ghost"
      />
      <UButton
        icon="i-simple-icons-instagram"
        aria-label="GymFlow na Instagramie"
        color="neutral"
        variant="ghost"
      />
      <UButton
        icon="i-simple-icons-x"
        aria-label="GymFlow na X"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
