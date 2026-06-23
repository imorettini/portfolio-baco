<script setup>
import { computed, inject, ref } from 'vue'
import { useWindowInteraction } from '../composables/useWindowInteraction.js'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '📁',
  },
  minimized: {
    type: Boolean,
    default: false,
  },
  maximized: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  zIndex: {
    type: Number,
    default: 1,
  },
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
  width: {
    type: Number,
    default: 320,
  },
  height: {
    type: Number,
    default: 240,
  },
  minWidth: {
    type: Number,
    default: 260,
  },
  minHeight: {
    type: Number,
    default: 160,
  },
})

const emit = defineEmits(['focus', 'minimize', 'maximize', 'close', 'update-bounds'])

const desktopRef = inject('desktopRef')
const windowRef = ref(null)

const isVisible = computed(() => !props.minimized)

const windowStyle = computed(() => ({
  zIndex: props.maximized ? 200 : props.zIndex,
  left: `${props.x}px`,
  top: `${props.y}px`,
  width: `${props.width}px`,
  height: `${props.height}px`,
}))

const resizeHandles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

function getDesktopRect() {
  const el = desktopRef?.value
  if (!el) {
    return {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight - 32,
    }
  }
  const rect = el.getBoundingClientRect()
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  }
}

const { startDrag, startResize } = useWindowInteraction({
  getBounds: () => ({
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
  }),
  onUpdate: (bounds) => emit('update-bounds', props.id, bounds),
  onFocus: () => emit('focus', props.id),
  minWidth: props.minWidth,
  minHeight: props.minHeight,
  getDesktopRect,
})

function onFocus() {
  emit('focus', props.id)
}

function onTitleMouseDown(event) {
  if (props.maximized || !windowRef.value) return
  startDrag(event, windowRef.value)
}

function onMinimize() {
  emit('minimize', props.id)
}

function onMaximize() {
  emit('maximize', props.id)
}

function onClose() {
  emit('close', props.id)
}

function onTitleDoubleClick() {
  emit('maximize', props.id)
}
</script>

<template>
  <section
    v-show="isVisible"
    ref="windowRef"
    class="absolute flex min-h-0 min-w-0 flex-col border-2 border-t-white border-l-white border-b-win-black border-r-win-black bg-win-gray shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
    :class="[active ? 'ring-0' : 'opacity-95', maximized ? 'z-[200]' : '']"
    :style="windowStyle"
    :aria-hidden="minimized"
    @mousedown="onFocus"
  >
    <!-- Barra de título (arrastar) -->
    <header
      class="flex shrink-0 cursor-move select-none items-center justify-between px-1 py-0.5"
      :class="
        active
          ? 'bg-gradient-to-r from-win-title to-win-title-active'
          : 'bg-gradient-to-r from-win-dark to-win-darker'
      "
      @mousedown="onTitleMouseDown"
      @dblclick="onTitleDoubleClick"
    >
      <div class="flex min-w-0 flex-1 items-center gap-1.5 px-0.5">
        <span class="shrink-0 text-xs" aria-hidden="true">{{ icon }}</span>
        <h2 class="truncate font-sans text-xs font-bold text-white">{{ title }}</h2>
      </div>

      <div class="flex shrink-0 gap-0.5" @mousedown.stop>
        <button
          type="button"
          class="win-btn-title cursor-default"
          aria-label="Minimizar"
          @click="onMinimize"
        >
          _
        </button>
        <button
          type="button"
          class="win-btn-title cursor-default"
          :aria-label="maximized ? 'Restaurar' : 'Maximizar'"
          @click="onMaximize"
        >
          {{ maximized ? '❐' : '□' }}
        </button>
        <button
          type="button"
          class="win-btn-title cursor-default font-bold"
          aria-label="Fechar"
          @click="onClose"
        >
          ×
        </button>
      </div>
    </header>

    <!-- Conteúdo -->
    <div class="min-h-0 flex-1 overflow-auto p-2 shadow-win-inset">
      <slot />
    </div>

    <!-- Alças de redimensionamento -->
    <template v-if="!maximized">
      <div
        v-for="dir in resizeHandles"
        :key="dir"
        class="resize-handle"
        :class="`resize-${dir}`"
        aria-hidden="true"
        @mousedown="startResize($event, dir)"
      />
    </template>
  </section>
</template>
