<script setup>
defineProps({
  windows: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['open', 'close'])

function openWindow(id) {
  emit('open', id)
  emit('close')
}
</script>

<template>
  <div
    class="absolute bottom-full left-0 z-[300] mb-0.5 w-52 border-2 border-t-white border-l-white border-b-win-black border-r-win-black bg-win-gray shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
    role="menu"
    aria-label="Menu Iniciar"
  >
    <!-- Sidebar decorativa -->
    <div class="flex">
      <div
        class="flex w-7 shrink-0 items-end bg-gradient-to-b from-win-title to-win-title-active p-1"
        aria-hidden="true"
      >
     <!--    <span
          class="mb-1 origin-bottom-left -rotate-90 whitespace-nowrap font-bold text-white"
          style="writing-mode: vertical-rl"
        >
          Windows&nbsp;95
        </span> -->
      </div>

      <div class="min-w-0 flex-1 py-1">
        <p class="px-2 py-0.5 font-sans text-[10px] font-bold text-win-darker">Programas</p>

        <button
          v-for="win in windows"
          :key="win.id"
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2 px-2 py-1 text-left font-sans text-xs hover:bg-win-title hover:text-white"
          @click="openWindow(win.id)"
        >
          <span aria-hidden="true">{{ win.icon }}</span>
          <span class="truncate">{{ win.shortTitle ?? win.title }}</span>
          <span v-if="win.closed" class="ml-auto text-[10px] text-win-darker">↵</span>
        </button>

        <hr class="my-1 border-t border-win-dark" />

        <button
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2 px-2 py-1 text-left font-sans text-xs hover:bg-win-title hover:text-white"
          @click="emit('close')"
        >
          <span aria-hidden="true">🚪</span>
          <span>Fechar Menu</span>
        </button>
      </div>
    </div>
  </div>
</template>
