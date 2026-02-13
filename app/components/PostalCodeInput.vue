<script setup lang="ts">
interface Props {
  placeholder?: string;
}

withDefaults(defineProps<Props>(), {
  placeholder: undefined,
});

const model = defineModel<string | undefined>({ required: true });
</script>

<template>
  <UInput v-model="model" v-maska="'##-###'" :placeholder="placeholder" />
</template>
