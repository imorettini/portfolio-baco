<script setup>
import { socialLinks } from '../data/portfolio.js'
</script>

<template>
  <nav aria-label="Links externos" class="flex flex-wrap justify-center gap-2 sm:justify-start">
    <a
      v-for="link in socialLinks"
      :key="link.id"
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
      class="desktop-icon"
    >
      <span class="text-3xl leading-none" aria-hidden="true">{{ link.icon }}</span>
      <span class="desktop-icon-label">{{ link.label }}</span>
    </a>
  </nav>
</template>
