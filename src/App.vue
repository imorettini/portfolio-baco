<script setup>
import { onMounted, onUnmounted, provide, ref } from 'vue'
import Win95Window from './components/Win95Window.vue'
import ProfileWindow from './components/ProfileWindow.vue'
import LinksWindow from './components/LinksWindow.vue'
import ExperienceWindow from './components/ExperienceWindow.vue'
import Taskbar from './components/Taskbar.vue'
import { useWindowManager } from './composables/useWindowManager.js'

const WINDOW_DEFS = [
  {
    id: 'profile',
    title: 'Quem Sou Eu — Perfil & Bio',
    shortTitle: 'Perfil & Bio',
    icon: '👤',
    defaultZ: 3,
    minWidth: 300,
    minHeight: 220,
    defaultBounds: { xPct: 0.02, yPct: 0.02, wPct: 0.46, hPct: 0.58 },
    mobileBounds: { xPct: 0.02, yPct: 0.02, wPct: 0.96, hPct: 0.36 },
  },
  {
    id: 'links',
    title: 'Atalhos de Rede',
    shortTitle: 'Atalhos',
    icon: '🌐',
    defaultZ: 2,
    minWidth: 260,
    minHeight: 180,
    defaultBounds: { xPct: 0.5, yPct: 0.02, wPct: 0.48, hPct: 0.32 },
    mobileBounds: { xPct: 0.02, yPct: 0.4, wPct: 0.96, hPct: 0.26 },
  },
  {
    id: 'experience',
    title: 'Histórico do Sistema — Experiências',
    shortTitle: 'Experiências',
    icon: '📋',
    defaultZ: 1,
    minWidth: 300,
    minHeight: 200,
    defaultBounds: { xPct: 0.5, yPct: 0.36, wPct: 0.48, hPct: 0.6 },
    mobileBounds: { xPct: 0.02, yPct: 0.68, wPct: 0.96, hPct: 0.3 },
  },
]

const desktopRef = ref(null)
provide('desktopRef', desktopRef)

const {
  windows,
  focus,
  minimize,
  maximize,
  close,
  open,
  toggleTaskbar,
  layoutWindows,
  updateBounds,
} = useWindowManager(WINDOW_DEFS)

function getWindow(id) {
  return windows.value.find((w) => w.id === id)
}

function getDef(id) {
  return WINDOW_DEFS.find((w) => w.id === id)
}

function onMaximize(id) {
  maximize(id, desktopRef.value)
}

function onUpdateBounds(id, bounds) {
  updateBounds(id, bounds, desktopRef.value)
}

function relayoutDesktop() {
  layoutWindows(desktopRef.value)
}

onMounted(() => {
  relayoutDesktop()
  focus('profile')

  window.addEventListener('resize', relayoutDesktop)
})

onUnmounted(() => {
  window.removeEventListener('resize', relayoutDesktop)
})
</script>

<template>
  <div class="crt-screen relative h-full w-full bg-win-teal">
    <main
      ref="desktopRef"
      class="relative h-[calc(100vh-2rem)] w-full overflow-hidden"
    >
      <!-- Perfil -->
      <Win95Window
        v-if="!getWindow('profile')?.closed"
        id="profile"
        :title="WINDOW_DEFS[0].title"
        :icon="WINDOW_DEFS[0].icon"
        :min-width="getDef('profile')?.minWidth"
        :min-height="getDef('profile')?.minHeight"
        :minimized="getWindow('profile')?.minimized ?? false"
        :maximized="getWindow('profile')?.maximized ?? false"
        :active="getWindow('profile')?.active ?? false"
        :z-index="getWindow('profile')?.zIndex ?? 1"
        :x="getWindow('profile')?.x ?? 0"
        :y="getWindow('profile')?.y ?? 0"
        :width="getWindow('profile')?.width ?? 320"
        :height="getWindow('profile')?.height ?? 240"
        @focus="focus"
        @minimize="minimize"
        @maximize="onMaximize"
        @close="close"
        @update-bounds="onUpdateBounds"
      >
        <ProfileWindow />
      </Win95Window>

      <!-- Links -->
      <Win95Window
        v-if="!getWindow('links')?.closed"
        id="links"
        :title="WINDOW_DEFS[1].title"
        :icon="WINDOW_DEFS[1].icon"
        :min-width="getDef('links')?.minWidth"
        :min-height="getDef('links')?.minHeight"
        :minimized="getWindow('links')?.minimized ?? false"
        :maximized="getWindow('links')?.maximized ?? false"
        :active="getWindow('links')?.active ?? false"
        :z-index="getWindow('links')?.zIndex ?? 1"
        :x="getWindow('links')?.x ?? 0"
        :y="getWindow('links')?.y ?? 0"
        :width="getWindow('links')?.width ?? 320"
        :height="getWindow('links')?.height ?? 240"
        @focus="focus"
        @minimize="minimize"
        @maximize="onMaximize"
        @close="close"
        @update-bounds="onUpdateBounds"
      >
        <LinksWindow />
      </Win95Window>

      <!-- Experiências -->
      <Win95Window
        v-if="!getWindow('experience')?.closed"
        id="experience"
        :title="WINDOW_DEFS[2].title"
        :icon="WINDOW_DEFS[2].icon"
        :min-width="getDef('experience')?.minWidth"
        :min-height="getDef('experience')?.minHeight"
        :minimized="getWindow('experience')?.minimized ?? false"
        :maximized="getWindow('experience')?.maximized ?? false"
        :active="getWindow('experience')?.active ?? false"
        :z-index="getWindow('experience')?.zIndex ?? 1"
        :x="getWindow('experience')?.x ?? 0"
        :y="getWindow('experience')?.y ?? 0"
        :width="getWindow('experience')?.width ?? 320"
        :height="getWindow('experience')?.height ?? 240"
        @focus="focus"
        @minimize="minimize"
        @maximize="onMaximize"
        @close="close"
        @update-bounds="onUpdateBounds"
      >
        <ExperienceWindow />
      </Win95Window>

      <div
        v-if="windows.every((w) => w.closed)"
        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 font-mono text-sm text-white"
      >
        <p>Nenhuma janela aberta.</p>
        <p class="text-xs opacity-80">Clique em <strong>Iniciar</strong> para abrir um programa.</p>
      </div>
    </main>

    <Taskbar
      :windows="windows"
      @toggle-window="toggleTaskbar"
      @open-window="open"
    />

    <div class="crt-overlay" aria-hidden="true" />
  </div>
</template>
