<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTextCycle } from '@/composables/useTextCycle'
import ParticleSphere from '@/components/ui/ParticleSphere.vue'
import ParticleField from '@/components/ui/ParticleField.vue'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'

const PHRASE_INTERVAL = 3000

const { tm } = useI18n()

const phrases = computed(() => tm('hero.phrases') as string[])

const { index } = useTextCycle(() => phrases.value.length, PHRASE_INTERVAL)
</script>

<template>
  <section id="hero" class="hero" aria-labelledby="hero-heading">
    <div class="hero__stars" aria-hidden="true">
      <ParticleField id="hero-stars" density="medium" :interactive="true" />
    </div>

    <div class="hero__text">
      <SectionEyebrow class="hero__anim hero__anim--1" :text="$t('hero.eyebrow')" />

      <h1 id="hero-heading" class="hero__name">
        <span class="hero__greeting">{{ $t('hero.greeting') }}</span>
        <span class="hero__fullname">{{ $t('hero.name') }}</span>
      </h1>

      <div class="hero__cycle" aria-live="polite" aria-atomic="true">
        <Transition name="phrase" mode="out-in">
          <span :key="index" class="hero__phrase">{{ phrases[index] }}</span>
        </Transition>
      </div>

      <p class="hero__bio hero__anim hero__anim--bio">{{ $t('hero.bio') }}</p>

      <div class="hero__ctas hero__anim hero__anim--ctas">
        <a href="mailto:slavik77rad@gmail.com" class="btn btn--primary">
          {{ $t('hero.cta_email') }}
        </a>
        <a
          href="https://t.me/yaroslav_radchuk"
          class="btn btn--ghost"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('hero.cta_telegram') }}
        </a>
      </div>
    </div>

    <div class="hero__visual" aria-hidden="true">
      <ParticleSphere />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: grid;
  grid-template-columns: 45% 55%;
  align-items: center;
  overflow-x: clip;

  &__stars {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  &__text {
    position: relative;
    z-index: 1;
    padding: 120px var(--spacing-24) var(--spacing-96) var(--spacing-60);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-18);
  }

  &__visual {
    position: relative;
    z-index: 1;
    height: 100svh;
    width: 100%;
  }

  &__name {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__greeting {
    display: block;
    font-size: clamp(13px, 1.4vw, 16px);
    font-weight: var(--font-weight-regular);
    color: var(--color-ash);
    letter-spacing: 0.08em;
    animation: void-emerge 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: 0.35s;
  }

  &__fullname {
    display: block;
    font-size: clamp(36px, 5vw, 62px);
    font-weight: var(--font-weight-extralight);
    color: var(--color-bone);
    line-height: 1.1;
    letter-spacing: var(--tracking-hero);
    white-space: nowrap;
    animation: line-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: 0.5s;
  }

  &__cycle {
    height: 1.3em;
    display: flex;
    align-items: center;
    animation: void-emerge 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: 0.85s;
  }

  &__phrase {
    display: block;
    font-size: clamp(20px, 2.6vw, 30px);
    font-weight: var(--font-weight-extralight);
    letter-spacing: 0.02em;
    background: linear-gradient(120deg, var(--color-plum-voltage) 20%, #c4acff 80%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__bio {
    font-size: var(--text-body);
    color: var(--color-ash);
    line-height: 1.65;
    max-width: 48ch;
  }

  &__ctas {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-12);
  }

  &__anim {
    animation: void-emerge 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;

    &--1 {
      animation-delay: 0.25s;
    }

    &--bio {
      animation-delay: 1.25s;
    }

    &--ctas {
      animation-delay: 1.45s;
    }
  }
}

.phrase {
  &-enter-active {
    animation: phrase-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  &-leave-active {
    animation: phrase-out 0.35s cubic-bezier(0.55, 0, 1, 0.45) forwards;
  }
}

@keyframes phrase-in {
  from {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes phrase-out {
  from {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }

  to {
    opacity: 0;
    transform: translateY(-10px);
    filter: blur(8px);
  }
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    grid-template-rows: auto 50vh;

    &__text {
      padding: 120px var(--spacing-24) var(--spacing-36);
    }

    &__fullname {
      font-size: clamp(32px, 11vw, 56px);
      white-space: normal;
    }

    &__visual {
      height: 50vh;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .phrase {
    &-enter-active,
    &-leave-active {
      animation-duration: 0.01ms;
    }
  }
}
</style>
