import { ref, onMounted, onUnmounted, readonly } from 'vue'

interface RevealOptions {
  threshold?: number
  rootMargin?: string
}

export function useRevealOnScroll(options: RevealOptions = {}) {
  const targetRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!targetRef.value) {
      return
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer?.disconnect()
        }
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '0px',
      },
    )

    observer.observe(targetRef.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { targetRef, isVisible: readonly(isVisible) }
}
