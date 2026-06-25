<script setup lang="ts">
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import ExperienceCard from '@/components/ui/ExperienceCard.vue'

const { targetRef: sectionRef, isVisible } = useRevealOnScroll({
  threshold: 0.08,
  rootMargin: '-60px 0px',
})

const jobs = [
  { key: 'evoplay', company: 'EvoPlay', year: '2026' },
  { key: 'skelar', company: 'Skelar', year: '2023' },
  { key: 'sigma', company: 'Sigma Software', year: '2020' },
]
</script>

<template>
  <section
    id="experience"
    ref="sectionRef"
    class="experience section-reveal"
    :class="{ 'is-visible': isVisible }"
    aria-labelledby="experience-heading"
  >
    <div class="experience__inner">
      <SectionEyebrow :text="$t('experience.eyebrow')" />
      <h2 id="experience-heading" class="text-display experience__heading">
        {{ $t('experience.heading') }}
      </h2>

      <div class="exp-roadmap">
        <div class="exp-roadmap__track" aria-hidden="true" />

        <div
          v-for="(job, i) in jobs"
          :key="job.key"
          class="exp-roadmap__stop"
          :style="`--i: ${i}`"
        >
          <div class="exp-roadmap__milestone" aria-hidden="true">
            <span class="exp-roadmap__year">{{ job.year }}</span>
            <div class="exp-roadmap__node">
              <span class="exp-roadmap__ring" />
            </div>
          </div>

          <ExperienceCard
            :company="job.company"
            :role="$t(`experience.${job.key}.role`)"
            :period="$t(`experience.${job.key}.period`)"
            :bullets="($tm(`experience.${job.key}.bullets`) as string[])"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
$year-w: 30px;
$node-d: 12px;
$gap: 8px;
$connector: 28px;
$track-left: calc(#{$year-w} + #{$gap} + #{$node-d} * 0.5);

.experience {
  padding: 80px 0 0;
  overflow: hidden;

  &__inner {
    max-width: var(--page-max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-36);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-36);
  }

  :deep(.experience__inner > :nth-child(1)),
  :deep(.experience__inner > :nth-child(2)) {
    opacity: 0;
    transform: translateY(28px);
  }

  &.is-visible {
    :deep(.experience__inner > :nth-child(1)) {
      animation: void-emerge 2s cubic-bezier(0.16, 1, 0.3, 1) both 0.2s;
    }

    :deep(.experience__inner > :nth-child(2)) {
      animation: void-emerge 2s cubic-bezier(0.16, 1, 0.3, 1) both 0.44s;
    }

    .exp-roadmap__track {
      animation: draw-track 1.6s cubic-bezier(0.16, 1, 0.3, 1) both 0.65s;
    }

    .exp-roadmap__stop {
      animation: stop-enter 1s cubic-bezier(0.16, 1, 0.3, 1) both;

      &:nth-child(1) {
        animation-delay: 0.65s;
      }

      &:nth-child(2) {
        animation-delay: 0.95s;
      }

      &:nth-child(3) {
        animation-delay: 1.25s;
      }
    }

    .exp-roadmap__ring {
      animation: pulse-ring 2.6s ease-out infinite;
      animation-delay: calc(var(--i) * 0.3s + 0.9s);
    }
  }
}

.exp-roadmap {
  position: relative;
  padding-left: calc(#{$year-w} + #{$gap} + #{$node-d} + #{$connector});

  &__track {
    position: absolute;
    left: $track-left;
    top: 18px;
    bottom: 60px;
    width: 1px;
    background: linear-gradient(
      to bottom,
      rgba(128, 82, 255, 0.7),
      rgba(21, 132, 110, 0.35) 70%,
      transparent
    );
    transform-origin: top center;
    transform: scaleY(0);
  }

  &__stop {
    position: relative;
    display: flex;
    padding-bottom: var(--spacing-36);
    opacity: 0;
    transform: translateX(36px);

    &:last-child {
      padding-bottom: 0;
    }
  }

  &__milestone {
    position: absolute;
    left: calc(-1 * (#{$year-w} + #{$gap} + #{$node-d} + #{$connector}));
    top: 8px;
    display: flex;
    align-items: center;
    gap: $gap;
  }

  &__year {
    width: $year-w;
    text-align: right;
    font-size: 11px;
    font-family: var(--font-acronym);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.1em;
    color: var(--color-plum-voltage);
  }

  &__node {
    width: $node-d;
    height: $node-d;
    border-radius: 50%;
    background: var(--color-plum-voltage);
    box-shadow:
      0 0 8px rgba(128, 82, 255, 0.8),
      0 0 20px rgba(128, 82, 255, 0.3);
    flex-shrink: 0;
    position: relative;
  }

  &__ring {
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    border: 1px solid rgba(128, 82, 255, 0.45);
    opacity: 0;
  }
}

@keyframes draw-track {
  from {
    transform: scaleY(0);
  }

  to {
    transform: scaleY(1);
  }
}

@keyframes stop-enter {
  from {
    opacity: 0;
    transform: translateX(36px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse-ring {
  0% {
    opacity: 0;
    transform: scale(1);
  }

  15% {
    opacity: 0.7;
  }

  100% {
    opacity: 0;
    transform: scale(2.8);
  }
}

@media (max-width: 600px) {
  .experience {
    padding-top: var(--spacing-60);

    &__inner {
      padding: 0 var(--spacing-24);
    }
  }

  .exp-roadmap {
    padding-left: calc(#{$node-d} + #{$connector});

    &__track {
      left: calc(#{$node-d} * 0.5);
    }

    &__milestone {
      left: calc(-1 * (#{$node-d} + #{$connector}));
    }

    &__year {
      display: none;
    }
  }
}
</style>
