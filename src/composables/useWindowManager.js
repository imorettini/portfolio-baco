import { reactive, ref, computed } from 'vue'

const DESKTOP_PADDING = 8

function boundsFromPercent(desktopRect, bounds) {
  return {
    x: desktopRect.width * bounds.xPct,
    y: desktopRect.height * bounds.yPct,
    width: desktopRect.width * bounds.wPct,
    height: desktopRect.height * bounds.hPct,
  }
}

function getDefaultBounds(def) {
  if (typeof window !== 'undefined' && window.innerWidth < 768 && def.mobileBounds) {
    return def.mobileBounds
  }
  return def.defaultBounds
}

export function useWindowManager(windowDefs) {
  const states = reactive(
    Object.fromEntries(
      windowDefs.map((win) => [
        win.id,
        {
          minimized: false,
          maximized: false,
          closed: false,
          zIndex: win.defaultZ ?? 1,
          x: 0,
          y: 0,
          width: 320,
          height: 240,
          restoreBounds: null,
          userPlaced: false,
        },
      ]),
    ),
  )

  const activeId = ref(windowDefs[0]?.id ?? null)
  let topZ = windowDefs.length

  const windows = computed(() =>
    windowDefs.map((def) => ({
      ...def,
      ...states[def.id],
      active: activeId.value === def.id,
    })),
  )

  const openWindows = computed(() => windows.value.filter((w) => !w.closed))

  function getDesktopRect(desktopEl) {
    if (!desktopEl) {
      return { width: window.innerWidth, height: window.innerHeight - 32 }
    }
    const rect = desktopEl.getBoundingClientRect()
    return { width: rect.width, height: rect.height }
  }

  function layoutWindows(desktopEl, { onlyUnplaced = true } = {}) {
    const desktopRect = getDesktopRect(desktopEl)

    for (const def of windowDefs) {
      const state = states[def.id]
      if (onlyUnplaced && state.userPlaced) continue
      if (state.maximized || state.closed) continue
      if (!def.defaultBounds) continue

      const bounds = boundsFromPercent(desktopRect, getDefaultBounds(def))
      state.x = bounds.x
      state.y = bounds.y
      state.width = Math.max(def.minWidth ?? 260, bounds.width)
      state.height = Math.max(def.minHeight ?? 160, bounds.height)
    }
  }

  function clampBounds(id, desktopEl) {
    const state = states[id]
    const def = windowDefs.find((w) => w.id === id)
    const desktopRect = getDesktopRect(desktopEl)
    const minW = def?.minWidth ?? 260
    const minH = def?.minHeight ?? 160

    state.width = Math.max(minW, Math.min(state.width, desktopRect.width - DESKTOP_PADDING * 2))
    state.height = Math.max(minH, Math.min(state.height, desktopRect.height - DESKTOP_PADDING * 2))
    state.x = Math.max(0, Math.min(state.x, desktopRect.width - state.width))
    state.y = Math.max(0, Math.min(state.y, desktopRect.height - state.height))
  }

  function updateBounds(id, bounds, desktopEl) {
    const state = states[id]
    Object.assign(state, bounds)
    state.userPlaced = true
    clampBounds(id, desktopEl)
  }

  function focus(id) {
    if (states[id].closed) return
    topZ += 1
    states[id].zIndex = topZ
    activeId.value = id
  }

  function minimize(id) {
    if (states[id].closed) return
    states[id].minimized = true
    states[id].maximized = false

    const visible = openWindows.value.filter((w) => !states[w.id].minimized)
    if (visible.length && activeId.value === id) {
      activeId.value = visible[0].id
      focus(visible[0].id)
    }
  }

  function maximize(id, desktopEl) {
    if (states[id].closed || states[id].minimized) return
    focus(id)

    const state = states[id]
    const desktopRect = getDesktopRect(desktopEl)

    if (!state.maximized) {
      state.restoreBounds = {
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
      }
      state.x = DESKTOP_PADDING
      state.y = DESKTOP_PADDING
      state.width = desktopRect.width - DESKTOP_PADDING * 2
      state.height = desktopRect.height - DESKTOP_PADDING * 2
      state.maximized = true
      return
    }

    if (state.restoreBounds) {
      state.x = state.restoreBounds.x
      state.y = state.restoreBounds.y
      state.width = state.restoreBounds.width
      state.height = state.restoreBounds.height
      state.restoreBounds = null
    }
    state.maximized = false
  }

  function close(id) {
    states[id].closed = true
    states[id].minimized = false
    states[id].maximized = false
    states[id].restoreBounds = null

    const remaining = openWindows.value.filter((w) => w.id !== id)
    if (activeId.value === id && remaining.length) {
      const next = remaining.find((w) => !states[w.id].minimized) ?? remaining[0]
      focus(next.id)
    } else if (!remaining.length) {
      activeId.value = null
    }
  }

  function open(id) {
    states[id].closed = false
    states[id].minimized = false
    focus(id)
  }

  function restore(id) {
    if (states[id].closed) {
      open(id)
      return
    }
    states[id].minimized = false
    focus(id)
  }

  function toggleTaskbar(id) {
    if (states[id].closed) {
      open(id)
      return
    }
    if (states[id].minimized) {
      restore(id)
      return
    }
    if (activeId.value === id && !states[id].maximized) {
      minimize(id)
      return
    }
    focus(id)
    states[id].minimized = false
  }

  return {
    windows,
    openWindows,
    activeId,
    layoutWindows,
    updateBounds,
    focus,
    minimize,
    maximize,
    close,
    open,
    restore,
    toggleTaskbar,
  }
}
