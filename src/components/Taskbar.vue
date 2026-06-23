<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import StartMenu from './StartMenu.vue'

defineProps({
  windows: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['toggle-window', 'open-window'])

const currentTime = ref('')
const visitCount = ref(0)
const startOpen = ref(false)

const VISIT_KEY = 'portfolio-visit-count'

function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function incrementVisits() {
  const stored = localStorage.getItem(VISIT_KEY)
  const count = stored ? parseInt(stored, 10) + 1 : 1
  localStorage.setItem(VISIT_KEY, String(count))
  visitCount.value = count
}

function toggleStart() {
  startOpen.value = !startOpen.value
}

function closeStart() {
  startOpen.value = false
}

function onToggleWindow(id) {
  emit('toggle-window', id)
}

function onOpenWindow(id) {
  emit('open-window', id)
}

let clockInterval

onMounted(() => {
  updateClock()
  incrementVisits()
  clockInterval = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  clearInterval(clockInterval)
})
</script>

<template>
  <footer
    class="fixed bottom-0 left-0 right-0 z-[250] flex h-8 items-center gap-1 border-t-2 border-t-white bg-win-gray px-1 shadow-[0_-1px_0_0_#000]"
    role="contentinfo"
    @click="closeStart"
  >
    <!-- Botão Iniciar + Menu -->
    <div class="relative shrink-0" @click.stop>
      <button
        type="button"
        class="win-btn flex h-[22px] items-center gap-1 px-2 font-bold"
        :class="{ 'shadow-win-button-pressed': startOpen }"
        aria-label="Menu Iniciar"
        aria-haspopup="menu"
        :aria-expanded="startOpen"
        @click="toggleStart"
      >
        <span class="text-sm" aria-hidden="true">🪟</span>
        <span class="hidden xs:inline sm:inline">Iniciar</span>
      </button>

      <StartMenu
        v-if="startOpen"
        :windows="windows"
        @open="onOpenWindow"
        @close="closeStart"
      />
    </div>

    <!-- Botões das janelas abertas -->
    <div class="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
      <button
        v-for="win in windows.filter((w) => !w.closed)"
        :key="win.id"
        type="button"
        class="win-btn flex h-[22px] max-w-[140px] shrink-0 items-center gap-1 truncate px-2 text-left text-xs sm:max-w-[180px]"
        :class="{ 'shadow-win-button-pressed font-bold': win.active && !win.minimized }"
        :aria-pressed="win.active && !win.minimized"
        @click.stop="onToggleWindow(win.id)"
      >
        <span class="shrink-0" aria-hidden="true">{{ win.icon }}</span>
        <span class="truncate">{{ win.shortTitle ?? win.title }}</span>
      </button>
    </div>

    <!-- Contador de visitas -->
    <div
      class="hidden shrink-0 items-center gap-1 border border-t-win-dark border-l-win-dark border-b-white border-r-white bg-win-gray px-2 py-0.5 font-mono text-[10px] shadow-win-inset sm:flex"
      aria-label="Contador de visitas"
    >
      <span class="text-win-darker" aria-hidden="true">👁</span>
      <span>VISITAS:</span>
      <span class="font-bold tabular-nums">{{ String(visitCount).padStart(6, '0') }}</span>
    </div>

    <!-- Relógio -->
    <time
      class="shrink-0 border border-t-win-dark border-l-win-dark border-b-white border-r-white bg-win-gray px-2 py-0.5 font-mono text-xs shadow-win-inset"
      :datetime="new Date().toISOString()"
    >
      {{ currentTime }}
    </time>
  </footer>
</template>
