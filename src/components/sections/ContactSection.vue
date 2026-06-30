<script setup lang="ts">
import { ref } from 'vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import { useEvaporate } from '@/composables/useEvaporate'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import PlanetGlobe from '@/components/ui/PlanetGlobe.vue'

const { targetRef: sectionRef, isVisible } = useRevealOnScroll({
  threshold: 0.3,
  rootMargin: '-120px 0px',
})

const { isPast } = useEvaporate(sectionRef)
const isHovering = ref(false)
</script>

<template>
  <section
    id="contact"
    ref="sectionRef"
    class="contact section-reveal"
    :class="{ 'is-visible': isVisible, 'is-past': isPast }"
    aria-labelledby="contact-heading"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="contact__globe" aria-hidden="true">
      <PlanetGlobe :hovering="isHovering" />
    </div>

    <div class="contact__inner">
      <SectionEyebrow class="contact__eyebrow" :text="$t('contact.eyebrow')" />

      <h2 id="contact-heading" class="contact__heading">
        <span class="contact__heading-line">{{ $t('contact.line1') }}</span>
        <span class="contact__heading-line contact__heading-line--accent">{{ $t('contact.line2') }}</span>
      </h2>

      <p class="contact__sub">{{ $t('contact.sub') }}</p>

      <div class="contact__cards" role="list">
        <a href="mailto:slavik77rad@gmail.com" class="contact__card" role="listitem">
          <span class="contact__card-icon" aria-hidden="true">✦</span>
          <span class="contact__card-label">{{ $t('contact.cta_email') }}</span>
          <span class="contact__card-arrow" aria-hidden="true">→</span>
        </a>
        <a
          href="https://t.me/yaroslav_radchuk"
          class="contact__card"
          role="listitem"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="contact__card-icon" aria-hidden="true">✦</span>
          <span class="contact__card-label">{{ $t('contact.cta_telegram') }}</span>
          <span class="contact__card-arrow" aria-hidden="true">→</span>
        </a>
        <a
          href="https://www.linkedin.com/in/%D1%8F%D1%80%D0%BE%D1%81%D0%BB%D0%B0%D0%B2-%D1%80%D0%B0%D0%B4%D1%87%D1%83%D0%BA-70221025a/?locale=en"
          class="contact__card"
          role="listitem"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`${$t('contact.linkedin')} (opens in new tab)`"
        >
          <span class="contact__card-icon" aria-hidden="true">✦</span>
          <span class="contact__card-label">{{ $t('contact.linkedin') }}</span>
          <span class="contact__card-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.contact {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(128, 82, 255, 0.772), transparent);
  }

  &__globe {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__inner {
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--spacing-18);
    padding: 0 var(--spacing-36) 240px;
    max-width: 680px;
    transition: opacity 0.7s ease, filter 0.7s ease, transform 0.7s ease;
  }

  &__eyebrow {
    opacity: 0;
    transform: translateY(24px);
  }

  &__heading {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: clamp(40px, 5.5vw, 76px);
    font-weight: var(--font-weight-extralight);
    letter-spacing: var(--tracking-display);
    line-height: 1.05;
    opacity: 0;
    transform: translateY(32px);

    &-line {
      display: block;
      color: var(--color-bone);
    }

    &-line--accent {
      background: linear-gradient(120deg, var(--color-plum-voltage) 10%, #c4acff 60%, #15846e 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__sub {
    font-size: var(--text-body);
    color: var(--color-ash);
    line-height: 1.7;
    max-width: 42ch;
    opacity: 0;
    transform: translateY(24px);
  }

  &__cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-12);
    margin-top: 4px;
  }

  &__card {
    display: flex;
    align-items: center;
    gap: var(--spacing-12);
    padding: 14px var(--spacing-24);
    border-radius: 48px;
    background: rgba(10, 6, 24, 0.55);
    border: 1px solid rgba(128, 82, 255, 0.35);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    color: var(--color-bone);
    text-decoration: none;
    font-size: var(--text-body-sm);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    transition: background 220ms ease, border-color 220ms ease, transform 220ms ease;

    &:hover {
      background: rgba(128, 82, 255, 0.16);
      border-color: rgba(128, 82, 255, 0.55);
      transform: translateY(-3px);
    }

    &:focus-visible {
      outline: 2px solid var(--color-plum-voltage);
      outline-offset: 3px;
    }
  }

  &__card-icon {
    color: var(--color-plum-voltage);
    font-size: 10px;
  }

  &__card-arrow {
    color: var(--color-ash);
    transition: transform 200ms ease, color 200ms ease;
  }

  &__card:hover &__card-arrow {
    transform: translateX(4px);
    color: var(--color-plum-voltage);
  }

  &.is-visible {
    .contact__eyebrow {
      animation: void-emerge 2s cubic-bezier(0.16, 1, 0.3, 1) both 0.2s;
    }

    .contact__heading {
      animation: void-emerge 2s cubic-bezier(0.16, 1, 0.3, 1) both 0.44s;
    }

    .contact__sub {
      animation: void-emerge 2s cubic-bezier(0.16, 1, 0.3, 1) both 0.68s;
    }
  }

  &.is-past &__inner {
    opacity: 0;
    filter: blur(12px);
    transform: translateY(-28px);
    pointer-events: none;
  }
}

@media (max-width: 600px) {
  .contact {
    align-items: center;

    &::before {
      top: 100px;
    }

    &__inner {
      padding-bottom: 0;
      margin-bottom: -200px;
    }

    &__cards {
      flex-direction: column;
      align-items: center;
      margin-top: 60px;
    }

    &__card {
      width: 100%;
      max-width: 280px;
      justify-content: center;
    }
  }
}
</style>
