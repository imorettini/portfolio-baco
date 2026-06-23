import { onUnmounted } from 'vue'

export function useWindowInteraction({
  getBounds,
  onUpdate,
  onFocus,
  minWidth = 260,
  minHeight = 160,
  getDesktopRect,
}) {
  let dragSession = null
  let resizeSession = null

  function stopInteraction() {
    dragSession = null
    resizeSession = null
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(event) {
    if (dragSession) {
      const desktop = getDesktopRect()
      const nextX = event.clientX - dragSession.offsetX - desktop.left
      const nextY = event.clientY - dragSession.offsetY - desktop.top

      onUpdate({
        x: Math.max(0, Math.min(nextX, desktop.width - dragSession.width)),
        y: Math.max(0, Math.min(nextY, desktop.height - dragSession.height)),
        width: dragSession.width,
        height: dragSession.height,
      })
      return
    }

    if (resizeSession) {
      const desktop = getDesktopRect()
      const dx = event.clientX - resizeSession.startX
      const dy = event.clientY - resizeSession.startY
      let { x, y, width, height } = resizeSession.startBounds

      const { direction } = resizeSession

      if (direction.includes('e')) width = resizeSession.startBounds.width + dx
      if (direction.includes('w')) {
        width = resizeSession.startBounds.width - dx
        x = resizeSession.startBounds.x + dx
      }
      if (direction.includes('s')) height = resizeSession.startBounds.height + dy
      if (direction.includes('n')) {
        height = resizeSession.startBounds.height - dy
        y = resizeSession.startBounds.y + dy
      }

      if (width < minWidth) {
        if (direction.includes('w')) x -= minWidth - width
        width = minWidth
      }
      if (height < minHeight) {
        if (direction.includes('n')) y -= minHeight - height
        height = minHeight
      }

      if (x < 0) {
        width += x
        x = 0
      }
      if (y < 0) {
        height += y
        y = 0
      }
      if (x + width > desktop.width) width = desktop.width - x
      if (y + height > desktop.height) height = desktop.height - y

      onUpdate({ x, y, width, height })
    }
  }

  function onMouseUp() {
    stopInteraction()
  }

  function startDrag(event, windowEl) {
    if (event.button !== 0) return

    onFocus()
    const bounds = getBounds()
    const desktop = getDesktopRect()
    const rect = windowEl.getBoundingClientRect()

    dragSession = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: bounds.width,
      height: bounds.height,
    }

    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'move'
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    event.preventDefault()
  }

  function startResize(event, direction) {
    if (event.button !== 0) return

    onFocus()
    resizeSession = {
      direction,
      startX: event.clientX,
      startY: event.clientY,
      startBounds: { ...getBounds() },
    }

    document.body.style.userSelect = 'none'
    document.body.style.cursor = `${direction}-resize`
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    event.preventDefault()
    event.stopPropagation()
  }

  onUnmounted(stopInteraction)

  return { startDrag, startResize }
}
