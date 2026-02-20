<script setup lang="ts">
const { data: page } = await useAsyncData("index", () =>
  queryCollection("index").first(),
);

const title = page.value?.seo?.title || page.value?.title;
const description = page.value?.seo?.description || page.value?.description;

useSeoMeta({
  titleTemplate: "",
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});
</script>

<template>
  <div v-if="page">
    <UPageHero :title="page.title" :description="page.description">
      <template #top>
        <div class="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80"
            alt="Siłownia"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black/55" />
        </div>
        <HeroBackground />
      </template>

      <template #title>
        <span
          class="text-white [text-shadow:0_2px_20px_rgba(0,0,0,1),0_0_40px_rgba(0,0,0,0.8)]"
        >
          <MDC :value="page.title" unwrap="p" />
        </span>
      </template>

      <template #description>
        <span
          class="text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,1),0_0_20px_rgba(0,0,0,0.8)]"
          >{{ page.description }}</span
        >
      </template>
    </UPageHero>

    <UPageSection
      v-for="(section, index) in page.sections"
      :key="index"
      :title="section.title"
      :description="section.description"
      :orientation="section.orientation"
      :reverse="section.reverse"
      :features="section.features"
    >
      <ImagePlaceholder />
    </UPageSection>

    <UPageSection
      :title="page.features.title"
      :description="page.features.description"
    >
      <UPageGrid>
        <UPageCard
          v-for="(item, index) in page.features.items"
          :key="index"
          v-bind="item"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

    <USeparator />

    <UPageCTA v-bind="page.cta" variant="naked" class="overflow-hidden">
      <LazyStarsBg />
    </UPageCTA>
  </div>
</template>
