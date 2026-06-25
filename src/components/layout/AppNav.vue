<script setup lang="ts">
import { ref } from 'vue'
import { useScrolled } from '@/composables/useScrolled'
import { useLocale } from '@/composables/useLocale'

const { isScrolled } = useScrolled()
const { locale, setLocale, availableLocales } = useLocale()
const isMenuOpen = ref(false)

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header role="banner">
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <Transition name="backdrop">
      <div v-if="isMenuOpen" class="nav-backdrop" @click="closeMenu" />
    </Transition>

    <nav
      class="nav"
      :class="{ 'nav--scrolled': isScrolled, 'nav--open': isMenuOpen }"
      aria-label="Primary navigation"
    >
      <div class="nav__inner">
        <a href="#" class="nav__logo" aria-label="Yaroslav Radchuk — home">YR</a>

        <ul class="nav__links" role="list">
          <li><a href="#about" class="nav__link">{{ $t('nav.about') }}</a></li>
          <li><a href="#skills" class="nav__link">{{ $t('nav.skills') }}</a></li>
          <li><a href="#experience" class="nav__link">{{ $t('nav.experience') }}</a></li>
          <li><a href="#contact" class="nav__link">{{ $t('nav.contact') }}</a></li>
        </ul>

        <div class="nav__actions">
          <div class="nav__lang" role="group" aria-label="Language selection">
            <button
              v-for="lang in availableLocales"
              :key="lang"
              class="nav__lang-btn"
              :class="{ 'nav__lang-btn--active': locale === lang }"
              :aria-pressed="locale === lang"
              :aria-label="`Switch to ${lang === 'en' ? 'English' : 'Ukrainian'}`"
              @click="setLocale(lang)"
            >
              {{ lang.toUpperCase() }}
            </button>
          </div>

          <a href="#contact" class="btn btn--primary nav__cta">
            {{ $t('nav.cta') }}
          </a>

          <button
            class="nav__hamburger"
            :class="{ 'nav__hamburger--open': isMenuOpen }"
            :aria-label="isMenuOpen ? $t('nav.menu_close') : $t('nav.menu_open')"
            :aria-expanded="isMenuOpen"
            @click="isMenuOpen = !isMenuOpen"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <Transition name="nav-menu">
        <div v-if="isMenuOpen" class="nav__dropdown">
          <ul class="nav__dropdown-list" role="list">
            <li class="nav__dropdown-item" style="--i: 0">
              <a href="#about" class="nav__dropdown-link" @click="closeMenu">{{ $t('nav.about') }}</a>
            </li>
            <li class="nav__dropdown-item" style="--i: 1">
              <a href="#skills" class="nav__dropdown-link" @click="closeMenu">{{ $t('nav.skills') }}</a>
            </li>
            <li class="nav__dropdown-item" style="--i: 2">
              <a href="#experience" class="nav__dropdown-link" @click="closeMenu">{{ $t('nav.experience') }}</a>
            </li>
            <li class="nav__dropdown-item" style="--i: 3">
              <a href="#contact" class="nav__dropdown-link" @click="closeMenu">{{ $t('nav.contact') }}</a>
            </li>
          </ul>
          <a href="#contact" class="btn btn--primary nav__dropdown-cta" @click="closeMenu">
            {{ $t('nav.cta') }}
          </a>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.nav-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99;
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background-color 300ms ease, backdrop-filter 300ms ease;

  &--scrolled,
  &--open {
    background-color: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(12px);
  }

  &__inner {
    max-width: var(--page-max-width);
    margin: 0 auto;
    padding: var(--spacing-18) var(--spacing-36);
    display: flex;
    align-items: center;
    gap: var(--spacing-24);
  }

  &__logo {
    font-size: var(--text-subheading);
    font-weight: var(--font-weight-semibold);
    color: var(--color-bone);
    letter-spacing: 0.05em;
    flex-shrink: 0;

    &:focus-visible {
      outline: 2px solid var(--color-plum-voltage);
      outline-offset: 3px;
      border-radius: 4px;
    }
  }

  &__links {
    display: flex;
    align-items: center;
    gap: var(--spacing-30);
    margin-left: auto;
  }

  &__link {
    font-size: var(--text-body-sm);
    color: var(--color-smoke);
    letter-spacing: var(--tracking-body-sm);
    transition: color 200ms ease;

    &:hover {
      color: var(--color-bone);
    }

    &:focus-visible {
      outline: 2px solid var(--color-plum-voltage);
      outline-offset: 3px;
      border-radius: 4px;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-18);
    flex-shrink: 0;
  }

  &__lang {
    display: flex;
    gap: 2px;
  }

  &__lang-btn {
    font-family: var(--font-acronym);
    font-size: var(--text-caption);
    font-weight: var(--font-weight-semibold);
    letter-spacing: var(--tracking-caption);
    color: var(--color-smoke);
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--spacing-6) var(--spacing-12);
    border-radius: var(--radius-interactive);
    transition: color 200ms ease;

    &:hover {
      color: var(--color-bone);
    }

    &--active {
      color: var(--color-bone);
      text-decoration: underline;
      text-underline-offset: 3px;
      text-decoration-color: var(--color-plum-voltage);
    }

    &:focus-visible {
      outline: 2px solid var(--color-plum-voltage);
      outline-offset: 2px;
    }
  }

  &__cta {
    flex-shrink: 0;
  }

  &__hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--spacing-6);

    span {
      display: block;
      width: 22px;
      height: 1px;
      background: var(--color-bone);
      transition:
        transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
        opacity 220ms ease;
    }

    &--open {
      span:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
      }

      span:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }

      span:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
      }
    }

    &:focus-visible {
      outline: 2px solid var(--color-plum-voltage);
      outline-offset: 3px;
      border-radius: 4px;
    }
  }

  &__dropdown {
    overflow: hidden;
    background: rgba(4, 1, 14, 0.97);
    backdrop-filter: blur(24px);
    border-top: 1px solid rgba(128, 82, 255, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0 0 16px 16px;
    padding: var(--spacing-12) var(--spacing-36) var(--spacing-24);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-18);
  }

  &__dropdown-list {
    display: flex;
    flex-direction: column;
  }

  &__dropdown-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    &:first-child {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
  }

  &__dropdown-link {
    display: block;
    padding: var(--spacing-18) 0;
    font-size: var(--text-subheading);
    font-weight: var(--font-weight-extralight);
    color: var(--color-smoke);
    letter-spacing: 0.02em;
    transition:
      color 200ms ease,
      transform 200ms ease;

    &:hover {
      color: var(--color-bone);
      transform: translateX(6px);
    }

    &:focus-visible {
      outline: 2px solid var(--color-plum-voltage);
      outline-offset: 3px;
      border-radius: 4px;
    }
  }

  &__dropdown-cta {
    width: 100%;
    justify-content: center;
  }
}

.nav-menu {
  &-enter-active {
    animation: nav-menu-in 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;

    .nav__dropdown-item {
      animation: item-slide-in 0.36s cubic-bezier(0.16, 1, 0.3, 1) both;
      animation-delay: calc(0.08s + var(--i) * 0.06s);
    }

    .nav__dropdown-cta {
      animation: item-slide-in 0.36s cubic-bezier(0.16, 1, 0.3, 1) both 0.32s;
    }
  }

  &-leave-active {
    animation: nav-menu-out 0.2s ease forwards;
  }
}

.backdrop {
  &-enter-active,
  &-leave-active {
    transition: opacity 220ms ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}

@keyframes nav-menu-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes nav-menu-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}

@keyframes item-slide-in {
  from {
    opacity: 0;
    transform: translateX(-14px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .nav {
    &__inner {
      justify-content: space-between;
    }

    &__links {
      display: none;
    }

    &__cta {
      display: none;
    }

    &__hamburger {
      display: flex;
    }
  }
}
</style>
