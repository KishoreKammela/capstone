import {
  AUTOPLAY_DELAY,
  enhanceSlide,
  buildIndicators,
  buildControls,
} from "../../utils/carousel.js";

/**
 * @param {HTMLElement} block The carousel block element
 */
export default function decorate(block) {
  const slides = [...block.children];
  if (!slides.length) return;

  const totalSlides = slides.length;

  slides.forEach((slide, index) => {
    enhanceSlide(slide, index, totalSlides);
  });

  block.setAttribute("id", "carousel");
  block.setAttribute("role", "region");
  block.setAttribute("aria-label", "Image carousel");
  block.setAttribute("aria-live", "polite");

  if (totalSlides <= 1) {
    slides[0].classList.add("is-active");
    slides[0].setAttribute("aria-hidden", "false");
    return;
  }

  let autoplayTimer;

  const indicatorWrapper = buildIndicators(slides, () => {});
  const indicatorButtons = [...indicatorWrapper.querySelectorAll("button")];

  let activeIndex = 0;

  const goTo = (index) => {
    const newIndex = (index + slides.length) % slides.length;
    setActiveSlide(newIndex);
  };

  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  const controls = buildControls(goPrev, goNext);

  const carouselWrapper = document.createElement("div");
  carouselWrapper.className = "carousel-wrapper";
  const navigationRow = document.createElement("div");
  navigationRow.className = "carousel__navigation";
  navigationRow.setAttribute("role", "toolbar");
  navigationRow.setAttribute("aria-label", "Carousel navigation");

  navigationRow.append(indicatorWrapper);
  navigationRow.append(controls);

  block.parentElement.insertBefore(carouselWrapper, block);
  carouselWrapper.append(block);
  carouselWrapper.append(navigationRow);

  const setActiveSlide = (index) => {
    const targetLeft = slides[index].offsetLeft - block.offsetLeft;
    block.scrollTo({
      top: 0,
      left: targetLeft,
      behavior: "smooth",
    });

    slides.forEach((slide, idx) => {
      const isActive = idx === index;
      slide.setAttribute("aria-hidden", !isActive);
      if (isActive) {
        slide.classList.add("is-active");
      } else {
        slide.classList.remove("is-active");
      }
    });

    indicatorButtons.forEach((btn, idx) => {
      const isActive = idx === index;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
      btn.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    activeIndex = index;
  };

  indicatorButtons.forEach((btn, idx) => {
    btn.addEventListener("click", () => goTo(idx));
  });

  let scrollTimeout;
  block.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollLeft = block.scrollLeft;
      const slideWidth = block.clientWidth;
      const currentIndex = Math.round(scrollLeft / slideWidth);
      if (currentIndex !== activeIndex) {
        activeIndex = currentIndex;
        indicatorButtons.forEach((btn, idx) => {
          const isActive = idx === currentIndex;
          btn.classList.toggle("is-active", isActive);
          btn.setAttribute("aria-selected", isActive ? "true" : "false");
          btn.setAttribute("tabindex", isActive ? "0" : "-1");
        });
        slides.forEach((slide, idx) => {
          slide.setAttribute("aria-hidden", idx !== currentIndex);
          if (idx === currentIndex) {
            slide.classList.add("is-active");
          } else {
            slide.classList.remove("is-active");
          }
        });
      }
    }, 100);
  });

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = window.setInterval(goNext, AUTOPLAY_DELAY);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) window.clearInterval(autoplayTimer);
  };

  block.addEventListener("mouseenter", stopAutoplay);
  block.addEventListener("mouseleave", startAutoplay);
  block.addEventListener("focusin", stopAutoplay);
  block.addEventListener("focusout", startAutoplay);

  setActiveSlide(0);
  startAutoplay();
}
