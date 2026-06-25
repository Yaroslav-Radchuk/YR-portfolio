<script setup lang="ts">
defineProps<{
  title: string
  description: string
  iconColor: string
}>()
</script>

<template>
  <article class="built-card">
    <div class="built-card__icon" :style="{ color: iconColor }" aria-hidden="true">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      >
        <polygon points="24,6 42,42 6,42" />
      </svg>
    </div>
    <h3 class="built-card__title">{{ title }}</h3>
    <p class="built-card__description">{{ description }}</p>
  </article>
</template>

<style lang="scss" scoped>
.built-card {
  padding: var(--card-padding);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-interactive);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-18);
  transition: border-color 200ms ease;

  &:hover {
    border-color: var(--color-plum-voltage);
  }

  &__title {
    font-size: var(--text-heading-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-bone);
    line-height: 1.2;
  }

  &__description {
    font-size: var(--text-body-sm);
    color: var(--color-ash);
    line-height: 1.6;
  }
}
</style>
