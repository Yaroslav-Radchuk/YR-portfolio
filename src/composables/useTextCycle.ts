import { ref, readonly, onMounted, onUnmounted } from 'vue'

export function useTextCycle(getLength: () => number, intervalMs = 3000) {
  const index = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    timer = setInterval(() => {
      index.value = (index.value + 1) % getLength()
    }, intervalMs)
  })

  onUnmounted(() => {
    if (timer !== null) {
      clearInterval(timer)
    }
  })

  return { index: readonly(index) }
}
