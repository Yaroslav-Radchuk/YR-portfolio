<script setup lang="ts">
import { useParticlesConfig } from '@/composables/useParticlesConfig'

interface Props {
  id?: string
  density?: 'high' | 'medium' | 'low'
  interactive?: boolean
  colors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  id: 'tsparticles',
  density: 'medium',
  interactive: true,
  colors: () => ['#8052ff', '#ffb829', '#15846e', '#ffffff'],
})

const { config } = useParticlesConfig({
  density: props.density,
  interactive: props.interactive,
  colors: props.colors,
})
</script>

<template>
  <div class="particle-field" aria-hidden="true">
    <vue-particles
      :id="id"
      :options="config"
      class="particle-field__canvas"
    />
  </div>
</template>

<style lang="scss" scoped>
.particle-field {
  position: absolute;
  inset: 0;
  pointer-events: none;

  &__canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
