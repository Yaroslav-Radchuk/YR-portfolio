import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useEvaporate(sectionRef: Ref<HTMLElement | null>, threshold = 0.22) {
  const isPast = ref(false)

  function onScroll() {
    if (!sectionRef.value) {
      return
    }

    const rect = sectionRef.value.getBoundingClientRect()
    isPast.value = rect.top < -window.innerHeight * threshold
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { isPast }
}
