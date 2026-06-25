<script setup lang="ts">
import { ref } from 'vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import ParticleWarning from '@/components/ui/ParticleWarning.vue'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'

const { targetRef: sectionRef, isVisible } = useRevealOnScroll({
  threshold: 0.05,
  rootMargin: '-40px 0px',
})

const textReady = ref(false)
</script>

<template>
  <section
    id="about"
    ref="sectionRef"
    class="about section-reveal"
    :class="{ 'is-visible': isVisible, 'text-ready': textReady }"
    aria-labelledby="about-heading"
  >
    <div class="about__visual" aria-hidden="true">
      <ParticleWarning @assembled="textReady = true" />
    </div>

    <div class="about__inner">
      <SectionEyebrow :text="$t('about.eyebrow')" />
      <h2 id="about-heading" class="text-display about__heading">{{ $t('about.heading') }}</h2>
      <p class="about__body">{{ $t('about.body') }}</p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.about {
  position: relative;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 52% 48%;
  align-items: center;
  overflow-x: clip;

  &__visual {
    position: relative;
    align-self: stretch;
    min-height: 100svh;
    transition: opacity 0.8s ease, transform 0.8s ease, filter 0.8s ease;
  }

  &__inner {
    position: relative;
    z-index: 1;
    padding: 0 var(--spacing-60) 0 var(--spacing-36);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-24);
    transition: opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease;
  }

  &__body {
    font-size: var(--text-body);
    color: var(--color-ash);
    line-height: 1.75;
    max-width: 52ch;
  }

  :deep(.about__inner > *) {
    opacity: 0;
    transform: translateY(28px);
  }

  &.text-ready {
    :deep(.about__inner > :nth-child(1)) {
      animation: about-slide-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) both 0s;
    }

    :deep(.about__inner > :nth-child(2)) {
      animation: about-slide-up 1.8s cubic-bezier(0.16, 1, 0.3, 1) both 0.28s;
    }

    :deep(.about__inner > :nth-child(3)) {
      animation: about-slide-up 1.8s cubic-bezier(0.16, 1, 0.3, 1) both 0.56s;
    }
  }

  &.is-past {
    .about__inner {
      opacity: 0;
      filter: blur(16px);
      transform: translateY(-40px);
    }

    .about__visual {
      opacity: 0;
      filter: blur(10px);
      transform: scale(0.93);
    }
  }
}

@keyframes about-slide-up {
  0% {
    opacity: 0;
    transform: translateY(60vh);
    filter: blur(10px);
  }

  40% {
    filter: blur(0);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@media (max-width: 900px) {
  .about {
    grid-template-columns: 1fr;
    min-height: unset;

    &__visual {
      display: none;
    }

    &__inner {
      padding: var(--spacing-36) var(--spacing-24);
    }
  }
}
</style>
