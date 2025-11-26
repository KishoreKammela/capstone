import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Organize footer sections
  const sections = [...footer.children];
  if (sections.length >= 2) {
    // Create top section wrapper (brand, nav, social)
    const topSection = document.createElement('div');
    topSection.className = 'footer__top';

    // First section: Brand/Logo
    if (sections[0]) {
      const brandWrapper = document.createElement('div');
      brandWrapper.className = 'footer__brand';
      const defaultWrapper = sections[0].querySelector('.default-content-wrapper');
      if (defaultWrapper) {
        brandWrapper.append(...defaultWrapper.children);
      } else {
        brandWrapper.append(...sections[0].children);
      }
      topSection.append(brandWrapper);
    }

    // Second section: Navigation
    if (sections[1]) {
      const navWrapper = document.createElement('div');
      navWrapper.className = 'footer__nav';
      
      // Extract navigation list
      const navList = sections[1].querySelector('ul');
      if (navList) {
        navList.className = 'footer__nav-list';
        navWrapper.append(navList);
        topSection.append(navWrapper);
      }
    }

    // Third section: Social media (if exists)
    if (sections[2]) {
      const socialWrapper = document.createElement('div');
      socialWrapper.className = 'footer__social';
      const defaultWrapper = sections[2].querySelector('.default-content-wrapper');
      if (defaultWrapper) {
        socialWrapper.append(...defaultWrapper.children);
      } else {
        socialWrapper.append(...sections[2].children);
      }
      topSection.append(socialWrapper);
    }

    footer.append(topSection);

    // Extract copyright and description from second section
    if (sections[1]) {
      const paragraphs = sections[1].querySelectorAll('p');
      if (paragraphs.length > 0) {
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'footer__content';
        paragraphs.forEach((p) => {
          // First paragraph with © is copyright
          if (p.textContent.includes('©')) {
            p.className = 'footer__copyright';
          }
          contentWrapper.append(p);
        });
        footer.append(contentWrapper);
      }
    }
  } else {
    // Fallback: just append sections as-is
    block.append(footer);
  }

  block.append(footer);
}
