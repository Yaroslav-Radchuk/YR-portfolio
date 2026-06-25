<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'

const { targetRef: sectionRef, isVisible } = useRevealOnScroll({
  threshold: 0.08,
  rootMargin: '-60px 0px',
})

interface Skill {
  name: string
  years: number
}

interface Category {
  id: string
  label: string
  skills: Skill[]
}

const categories: Category[] = [
  {
    id: 'frontend',
    label: 'FRONTEND',
    skills: [
      { name: 'JavaScript', years: 7 },
      { name: 'TypeScript', years: 6 },
      { name: 'Vue', years: 6 },
      { name: 'Pinia', years: 3 },
      { name: 'Vuex', years: 3 },
      { name: 'Vue Router', years: 5 },
      { name: 'Nuxt', years: 5 },
      { name: 'HTML/CSS', years: 7 },
      { name: 'SCSS', years: 6 },
      { name: 'React', years: 3 },
      { name: 'React Native', years: 2 },
      { name: 'PWA', years: 3 },
    ],
  },
  {
    id: 'ui',
    label: 'UI LIBRARIES',
    skills: [
      { name: 'Tailwind CSS', years: 5 },
      { name: 'Material UI (MUI)', years: 5 },
      { name: 'Bootstrap', years: 5 },
      { name: 'Vuetify', years: 4 },
      { name: 'Chart.js', years: 4 },
    ],
  },
  {
    id: 'api',
    label: 'API & DATA',
    skills: [
      { name: 'REST API', years: 6 },
      { name: 'Axios', years: 5 },
      { name: 'i18n', years: 4 },
      { name: 'WebSockets', years: 3 },
    ],
  },
  {
    id: 'tools',
    label: 'TOOLS & DEVOPS',
    skills: [
      { name: 'Git', years: 7 },
      { name: 'GitHub/GitLab', years: 7 },
      { name: 'Webpack', years: 4 },
      { name: 'Vite', years: 3 },
      { name: 'Jira', years: 6 },
      { name: 'Figma', years: 6 },
      { name: 'Postman', years: 3 },
      { name: 'Swagger', years: 2 },
      { name: 'Storybook', years: 2 },
    ],
  },
]

const cardProgress = categories.map(() => ref(0))

const COUNT_DURATION = 2400
const CARD_STAGGER = 2700
const INITIAL_DELAY = 500

const timers: ReturnType<typeof setTimeout>[] = []
const rafs: number[] = []

watch(isVisible, (v) => {
  if (!v) {
    return
  }

  categories.forEach((_, ci) => {
    timers.push(
      setTimeout(() => {
        const progress = cardProgress[ci]
        const start = performance.now()

        function tick(now: number) {
          const t = Math.min(1, (now - start) / COUNT_DURATION)
          progress.value = t

          if (t < 1) {
            rafs.push(requestAnimationFrame(tick))
          }
        }

        rafs.push(requestAnimationFrame(tick))
      }, INITIAL_DELAY + ci * CARD_STAGGER),
    )
  })
})

function displayedYears(target: number, catIdx: number, skillIdx: number): number {
  const n = categories[catIdx].skills.length
  const p = cardProgress[catIdx].value
  const wStart = skillIdx / n
  const wEnd = (skillIdx + 1) / n
  const t = Math.max(0, Math.min(1, (p - wStart) / (wEnd - wStart)))

  return Math.round(t * t * (3 - 2 * t) * target)
}

function isCountDone(catIdx: number, skillIdx: number): boolean {
  const n = categories[catIdx].skills.length

  return cardProgress[catIdx].value >= (skillIdx + 1) / n
}

onUnmounted(() => {
  timers.forEach(clearTimeout)
  rafs.forEach(cancelAnimationFrame)
})
</script>

<template>
  <section
    id="skills"
    ref="sectionRef"
    class="skills section-reveal"
    :class="{ 'is-visible': isVisible }"
    aria-labelledby="skills-heading"
  >
    <div class="skills__inner">
      <SectionEyebrow :text="$t('skills.eyebrow')" />
      <h2 id="skills-heading" class="text-display skills__heading">
        {{ $t('skills.heading') }}
      </h2>

      <div class="skills__grid">
        <div
          v-for="(cat, catIdx) in categories"
          :key="cat.id"
          class="skills-card"
        >
          <p class="skills-card__header">{{ cat.label }}</p>

          <ul class="skills-card__list">
            <li
              v-for="(skill, skillIdx) in cat.skills"
              :key="skill.name"
              class="skills-card__row"
            >
              <span class="skills-card__dot" />
              <span class="skills-card__name">{{ skill.name }}</span>
              <span
                class="skills-card__years"
                :class="{ 'skills-card__years--done': isCountDone(catIdx, skillIdx) }"
              >{{ displayedYears(skill.years, catIdx, skillIdx) }}y</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.skills {
  
  &__inner {
    max-width: var(--page-max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-36);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-36);
  }

  &__heading {
    opacity: 0;
    transform: translateY(28px);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    align-items: start;
  }

  &.is-visible {
    :deep(.skills__inner > :nth-child(1)) {
      animation: void-emerge 2s cubic-bezier(0.16, 1, 0.3, 1) both 0.2s;
    }

    .skills__heading {
      animation: void-emerge 2s cubic-bezier(0.16, 1, 0.3, 1) both 0.44s;
    }

    .skills-card:nth-child(1) {
      animation: void-emerge-subtle 1.4s cubic-bezier(0.16, 1, 0.3, 1) both 0.5s;
    }

    .skills-card:nth-child(2) {
      animation: void-emerge-subtle 1.4s cubic-bezier(0.16, 1, 0.3, 1) both 3.2s;
    }

    .skills-card:nth-child(3) {
      animation: void-emerge-subtle 1.4s cubic-bezier(0.16, 1, 0.3, 1) both 5.9s;
    }

    .skills-card:nth-child(4) {
      animation: void-emerge-subtle 1.4s cubic-bezier(0.16, 1, 0.3, 1) both 8.6s;
    }
  }
}

.skills-card {
  opacity: 0;
  transform: translateY(36px);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.072);
  border-radius: 16px;
  padding: 24px 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  &__header {
    font-size: 10.5px;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-smoke);
    font-weight: var(--font-weight-semibold);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 11px;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    background: rgba(128, 82, 255, 0.6);
  }

  &__name {
    flex: 1;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.82);
    font-weight: var(--font-weight-regular);
  }

  &__years {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.28);
    font-variant-numeric: tabular-nums;
    font-weight: var(--font-weight-semibold);
    min-width: 22px;
    text-align: right;
    transition: color 0.5s ease;

    &--done {
      color: var(--color-plum-voltage);
    }
  }
}

@media (max-width: 1024px) {
  .skills__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .skills__grid {
    grid-template-columns: 1fr;
  }
}
</style>
