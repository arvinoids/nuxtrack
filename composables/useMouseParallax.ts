export const useMouseParallax = (strength = 20, lerp = 0.12) => {
  const tx = ref(0)
  const ty = ref(0)
  const cx = ref(0)
  const cy = ref(0)
  let animationId: number
  let mouseMoveHandler: (e: MouseEvent) => void

  const updateParallax = () => {
    cx.value += (tx.value - cx.value) * lerp
    cy.value += (ty.value - cy.value) * lerp
    document.documentElement.style.setProperty('--shift-x', `${cx.value}px`)
    document.documentElement.style.setProperty('--shift-y', `${cy.value}px`)
    animationId = requestAnimationFrame(updateParallax)
  }

  const cleanup = () => {
    if (animationId) cancelAnimationFrame(animationId)
    if (mouseMoveHandler) window.removeEventListener('mousemove', mouseMoveHandler)
  }

  mouseMoveHandler = (e) => {
    tx.value = ((e.clientX / window.innerWidth) - 0.5) * 2 * strength
    ty.value = ((e.clientY / window.innerHeight) - 0.5) * 2 * strength
  }
  window.addEventListener('mousemove', mouseMoveHandler)
  updateParallax()

  return cleanup
}