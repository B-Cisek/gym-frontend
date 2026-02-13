<script setup lang="ts">
interface MaskaDetail {
  masked: string;
  unmasked: string;
  completed: boolean;
}

const model = defineModel<string | undefined>({ required: true });

function onMaska(event: CustomEvent<MaskaDetail>) {
  model.value = event.detail.unmasked;
}
</script>

<template>
  <UInput
    v-maska="'### ### ###'"
    :value="model"
    :ui="{
      base: 'pl-10',
      leading: 'pointer-events-none',
    }"
    @maska="onMaska"
  >
    <template #leading>
      <p class="text-sm text-muted">+48</p>
    </template>
  </UInput>
</template>
