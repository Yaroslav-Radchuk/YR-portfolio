<script setup lang="ts">
defineProps<{
  company: string
  role: string
  period: string
  bullets: string[]
}>()
</script>

<template>
  <article class="exp-card">
    <div class="exp-card__header">
      <div class="exp-card__top-row">
        <span class="exp-card__company">{{ company }}</span>
        <time class="exp-card__period">{{ period }}</time>
      </div>
      <p class="exp-card__role">{{ role }}</p>
    </div>
    <ul class="exp-card__bullets">
      <li v-for="bullet in bullets" :key="bullet">
        <span class="exp-card__bullet-pip" aria-hidden="true" />
        {{ bullet }}
      </li>
    </ul>
  </article>
</template>

<style lang="scss" scoped>
.exp-card {
  flex: 1;
  min-width: 0;
  background: rgba(128, 82, 255, 0.04);
  border: 1px solid rgba(128, 82, 255, 0.14);
  border-radius: 16px;
  padding: var(--spacing-24) var(--spacing-30);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: border-color 320ms ease, background 320ms ease, box-shadow 320ms ease;

  &:hover {
    border-color: rgba(128, 82, 255, 0.34);
    background: rgba(128, 82, 255, 0.08);
    box-shadow: 0 0 32px rgba(128, 82, 255, 0.08);
  }

  &__top-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--spacing-12);
    flex-wrap: wrap;
    margin-bottom: 4px;
  }

  &__company {
    font-size: var(--text-heading-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-bone);
    letter-spacing: -0.01em;
  }

  &__period {
    font-size: 11px;
    font-family: var(--font-acronym);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-plum-voltage);
    white-space: nowrap;
  }

  &__role {
    font-size: var(--text-body-sm);
    color: var(--color-plum-voltage);
    margin-bottom: var(--spacing-18);
  }

  &__bullets {
    display: flex;
    flex-direction: column;
    gap: 10px;

    li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: var(--text-body-sm);
      color: var(--color-ash);
      line-height: 1.65;
    }
  }

  &__bullet-pip {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(128, 82, 255, 0.6);
    flex-shrink: 0;
    margin-top: 7px;
  }

  @media (max-width: 600px) {
    padding: var(--spacing-18) var(--spacing-24);

    &__top-row {
      flex-direction: column;
      gap: 4px;
    }
  }
}
</style>
