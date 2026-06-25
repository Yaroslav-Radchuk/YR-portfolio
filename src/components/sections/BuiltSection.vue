<script setup lang="ts">
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import BuiltCard from '@/components/ui/BuiltCard.vue'

const { targetRef: sectionRef, isVisible } = useRevealOnScroll({
  threshold: 0.1,
  rootMargin: '-80px 0px',
})

const cards = [
  { key: 'highload', color: 'var(--color-plum-voltage)' },
  { key: 'crm', color: 'var(--color-amber-spark)' },
  { key: 'realtime', color: 'var(--color-lichen)' },
  { key: 'nuxt', color: 'var(--color-bone)' },
  { key: 'spa', color: 'var(--color-plum-voltage)' },
]
</script>

<template>
  <section
    id="built"
    ref="sectionRef"
    class="built section-reveal"
    :class="{ 'is-visible': isVisible }"
    aria-labelledby="built-heading"
  >
    <div class="built__inner">
      <SectionEyebrow :text="$t('built.eyebrow')" />
      <h2 id="built-heading" class="text-display built__heading">{{ $t('built.heading') }}</h2>

      <div class="built__grid">
        <BuiltCard
          v-for="card in cards"
          :key="card.key"
          :title="$t(`built.cards.${card.key}.title`)"
          :description="$t(`built.cards.${card.key}.description`)"
          :icon-color="card.color"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.built {
  padding: 80px 0;
  overflow: hidden;

  &__inner {
    max-width: var(--page-max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-36);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-36);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-18);

    > :last-child:nth-child(odd) {
      grid-column: 1 / -1;
      max-width: 50%;
    }
  }

  :deep(.built__inner > :nth-child(1)),
  :deep(.built__inner > :nth-child(2)) {
    opacity: 0;
    transform: translateY(28px);
  }

  :deep(.built-card:nth-child(odd)) {
    opacity: 0;
    transform: translateX(-70px);
  }

  :deep(.built-card:nth-child(even)) {
    opacity: 0;
    transform: translateX(70px);
  }

  &.is-visible {
    :deep(.built__inner > :nth-child(1)) {
      animation: void-emerge 2s cubic-bezier(0.16, 1, 0.3, 1) both 0.2s;
    }

    :deep(.built__inner > :nth-child(2)) {
      animation: void-emerge 2s cubic-bezier(0.16, 1, 0.3, 1) both 0.44s;
    }

    :deep(.built-card:nth-child(1)) {
      animation: built-from-left 1.1s cubic-bezier(0.16, 1, 0.3, 1) both 0.6s;
    }

    :deep(.built-card:nth-child(2)) {
      animation: built-from-right 1.1s cubic-bezier(0.16, 1, 0.3, 1) both 1.1s;
    }

    :deep(.built-card:nth-child(3)) {
      animation: built-from-left 1.1s cubic-bezier(0.16, 1, 0.3, 1) both 1.6s;
    }

    :deep(.built-card:nth-child(4)) {
      animation: built-from-right 1.1s cubic-bezier(0.16, 1, 0.3, 1) both 2.1s;
    }

    :deep(.built-card:nth-child(5)) {
      animation: built-from-left 1.1s cubic-bezier(0.16, 1, 0.3, 1) both 2.6s;
    }
  }
}

@keyframes built-from-left {
  from {
    opacity: 0;
    transform: translateX(-70px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes built-from-right {
  from {
    opacity: 0;
    transform: translateX(70px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 600px) {
  .built {
    padding: var(--spacing-60) 0 0;

    &__grid {
      grid-template-columns: 1fr;

      > :last-child:nth-child(odd) {
        max-width: 100%;
      }
    }
  }
}
</style>
