<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?:
    | "error"
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "neutral";
}

withDefaults(defineProps<Props>(), {
  description: undefined,
  confirmLabel: "Potwierdź",
  cancelLabel: "Anuluj",
  confirmColor: "error",
});

const emits = defineEmits<{
  close: [value: boolean];
}>();
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :dismissible="false"
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer>
      <UButton
        :label="cancelLabel"
        color="neutral"
        variant="outline"
        @click="emits('close', false)"
      />
      <UButton
        :label="confirmLabel"
        :color="confirmColor"
        @click="emits('close', true)"
      />
    </template>
  </UModal>
</template>
