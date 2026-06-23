<script setup>
import { profile } from '../data/portfolio.js'
</script>

<template>
  <article class="flex flex-col gap-3 sm:flex-row sm:items-start">
    <!-- Foto com moldura recuada -->
    <figure class="mx-auto shrink-0 sm:mx-0">
      <div class="border-2 border-t-win-dark border-l-win-dark border-b-white border-r-white bg-win-gray p-1 shadow-win-inset">
        <img
          :src="profile.photo"
          :alt="`Foto de perfil de ${profile.name}`"
          class="h-28 w-28 object-cover sm:h-32 sm:w-32"
          width="128"
          height="128"
        />
      </div>
      <figcaption class="mt-1 text-center font-mono text-[10px] text-win-darker">
        perfil.bmp
      </figcaption>
    </figure>

    <!-- Bio -->
    <div class="min-w-0 flex-1">
      <h3 class="mb-1 font-sans text-base font-bold">{{ profile.name }}</h3>
      <p class="mb-2 font-mono text-xs text-win-title">&gt; {{ profile.title }}</p>
      <p class="whitespace-pre-line font-sans text-xs leading-relaxed">
        {{ profile.bio }}
      </p>
    </div>
  </article>
</template>
