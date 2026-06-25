<script setup lang="ts">
import { defineAsyncComponent, watch } from 'vue'
import AppNav from '@/components/layout/AppNav.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ShootingStars from '@/components/ui/ShootingStars.vue'
import { useLocale } from '@/composables/useLocale'

const AboutSection = defineAsyncComponent(() => import('@/components/sections/AboutSection.vue'))
const BuiltSection = defineAsyncComponent(() => import('@/components/sections/BuiltSection.vue'))
const SkillsSection = defineAsyncComponent(() => import('@/components/sections/SkillsSection.vue'))
const ExperienceSection = defineAsyncComponent(() => import('@/components/sections/ExperienceSection.vue'))
const ContactSection = defineAsyncComponent(() => import('@/components/sections/ContactSection.vue'))

const { locale } = useLocale()

watch(locale, (lang) => {
  document.documentElement.lang = lang
}, { immediate: true })
</script>

<template>
  <div id="app-root">
    <ShootingStars class="app-stars" />
    <AppNav />
    <main id="main-content" tabindex="-1">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <BuiltSection />
      <ContactSection />
    </main>
    <AppFooter />
  </div>
</template>

<style>
.app-stars {
  position: fixed !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none;
  z-index: 0;
}
</style>
