<script setup>
import { experiences } from '../data/portfolio.js'
</script>

<template>
  <div class="font-mono text-xs">
    <!-- Cabeçalho estilo gerenciador de arquivos -->
    <div class="mb-2 flex items-center gap-2 border-b border-win-dark pb-1 text-win-darker">
      <span aria-hidden="true">📂</span>
      <span>C:\Sistema\Experiencias\</span>
    </div>

    <ul class="space-y-2" role="list">
      <li
        v-for="exp in experiences"
        :key="exp.id"
        class="border border-t-win-dark border-l-win-dark border-b-white border-r-white bg-white p-2 shadow-win-inset"
      >
        <div class="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span class="font-bold text-win-title">[{{ exp.period }}]</span>
          <span class="font-bold">{{ exp.role }}</span>
          <span class="text-win-darker">@ {{ exp.company }}</span>
        </div>
        <p class="pl-2 font-sans text-[11px] leading-snug text-win-darker">
          └─ {{ exp.description }}
        </p>
      </li>
    </ul>
  </div>
</template>
