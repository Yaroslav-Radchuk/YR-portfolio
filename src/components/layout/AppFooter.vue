<template>
  <footer class="footer" role="contentinfo">
    <div class="footer__inner">
      <span class="footer__copy">{{ $t('footer.copyright') }}</span>
      <nav class="footer__links" aria-label="Footer links">
        <a
          href="mailto:slavik77rad@gmail.com"
          class="footer__link"
        >slavik77rad@gmail.com</a>
        <a
          href="https://t.me/yaroslav_radchuk"
          class="footer__link"
          target="_blank"
          rel="noopener noreferrer"
        >Telegram</a>
        <a
          href="https://www.linkedin.com/in/%D1%8F%D1%80%D0%BE%D1%81%D0%BB%D0%B0%D0%B2-%D1%80%D0%B0%D0%B4%D1%87%D1%83%D0%BA-70221025a/?locale=en"
          class="footer__link"
          target="_blank"
          rel="noopener noreferrer"
        >LinkedIn</a>
      </nav>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: var(--spacing-30) 0;

  &__inner {
    max-width: var(--page-max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-36);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--spacing-18);
  }

  &__copy {
    font-size: var(--text-caption);
    color: var(--color-smoke);
    letter-spacing: var(--tracking-caption);
  }

  &__links {
    display: flex;
    gap: var(--spacing-18);
  }

  &__link {
    font-size: var(--text-caption);
    color: var(--color-smoke);
    letter-spacing: var(--tracking-caption);
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
}

@media (max-width: 600px) {
  .footer {
    &__inner {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    &__copy {
      order: 2;
    }

    &__links {
      order: 1;
    }
  }
}
</style>
