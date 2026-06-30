# Yaroslav Radchuk — Portfolio

Cosmic-themed portfolio landing page with Canvas animations and bilingual support.

**[→ Live Demo](https://yaroslav-radchuk.vercel.app/)**

---

## Stack

Vue 3 Composition API, TypeScript, Vite, vue-i18n (EN/UK).

Animations — Canvas 2D API + `requestAnimationFrame`, zero animation libraries.

---

## Architecture

### Structure

Sections are split into individual components under `sections/`. UI primitives (canvas animations, eyebrow, cards) live in `components/ui/`. Logic is extracted into composables: `useRevealOnScroll`, `useTextCycle`, `useEvaporate`, `useParticlesConfig`, `useLocale`, `useScrolled`.

### Canvas components

Each canvas component (`ParticleSphere`, `ParticleWarning`, `ShootingStars`, `PlanetGlobe`, `ParticleField`) is fully isolated — its own `requestAnimationFrame` loop, `ResizeObserver`, and cleanup on `onUnmounted`. No shared global state between them.

`ParticleWarning` (triangle in the About section) and `ParticleSphere` (sphere in Hero) animate a scatter effect on scroll: particles fly apart in 3D space and return on scroll back. The canvas is intentionally oversized (200% of the container) so particles aren't clipped during the scatter animation.

### Scroll and animations

Section transitions are driven by `useRevealOnScroll` — an `IntersectionObserver` adds `.is-visible` / `.is-past` classes to each section. All entry animations are CSS `@keyframes` triggered by these classes, no JS animations.

Horizontal scroll on mobile is fixed via `overflow: hidden` on sections (not `overflow-x: hidden` on `html`) to avoid breaking vertical scroll or creating unintended scroll containers.

### i18n

Two locales — EN and UK. Switching is instant with no page reload. `html[lang]` is updated via `watch(locale)` in `App.vue`. All copy lives in `src/locales/`.

---

## Technologies

![Vue 3](https://img.shields.io/badge/Vue_3-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![vue-i18n](https://img.shields.io/badge/vue--i18n-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Canvas API](https://img.shields.io/badge/Canvas_2D_API-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![tsParticles](https://img.shields.io/badge/tsParticles-0D1117?style=for-the-badge&logo=npm&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

---

## Getting started

```bash
npm install
npm run dev
```

```bash
npm run build
```

```bash
npm run test
```
