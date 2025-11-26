const AUTOPLAY_DELAY = 5000;

function enhanceSlide(slide, slideIndex, totalSlides) {
  const cols = [...slide.children];
  if (!cols.length) return;

  const mediaWrapper = document.createElement("div");
  mediaWrapper.className = "homebanner__media";

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "homebanner__content";

  // Process columns
  cols.forEach((col, index) => {
    // First column is image
    if (index === 0) {
      const picture = col.querySelector("picture");
      if (picture) {
        mediaWrapper.append(picture);
      }
    } else {
      // All other columns go to content wrapper
      while (col.firstElementChild) {
        const child = col.firstElementChild;
        // Add button class to links
        if (child.tagName === "A" || child.querySelector("a")) {
          const link = child.tagName === "A" ? child : child.querySelector("a");
          if (link) link.classList.add("button");
        }
        contentWrapper.append(child);
      }
    }
  });

  slide.textContent = "";
  slide.append(mediaWrapper, contentWrapper);

  // Store content wrapper reference for indicators
  slide._contentWrapper = contentWrapper;
  slide.classList.add("homebanner__slide");
  slide.setAttribute("role", "group");
  slide.setAttribute("aria-roledescription", "slide");
  slide.setAttribute("aria-label", `Slide ${slideIndex + 1} of ${totalSlides}`);
}

function buildIndicators(slides, switchSlide) {
  const indicators = document.createElement("div");
  indicators.className = "homebanner__indicators";

  slides.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "homebanner__indicator";
    button.setAttribute("aria-label", `Slide ${index + 1}`);
    button.addEventListener("click", () => switchSlide(index));
    indicators.append(button);
  });

  return indicators;
}

function buildControls(prevHandler, nextHandler) {
  const controls = document.createElement("div");
  controls.className = "homebanner__controls";

  const prev = document.createElement("button");
  prev.type = "button";
  prev.className = "homebanner__control homebanner__control--prev";
  prev.setAttribute("aria-label", "Previous slide");
  prev.addEventListener("click", prevHandler);
  prev.innerHTML = "&larr;";

  const next = document.createElement("button");
  next.type = "button";
  next.className = "homebanner__control homebanner__control--next";
  next.setAttribute("aria-label", "Next slide");
  next.addEventListener("click", nextHandler);
  next.innerHTML = "&rarr;";

  controls.append(prev, next);
  return controls;
}

export default function decorate(block) {
  const slides = [...block.children];
  if (!slides.length) return;

  const totalSlides = slides.length;
  const slidesWrapper = document.createElement("div");
  slidesWrapper.className = "homebanner__slides";

  slides.forEach((slide, index) => {
    enhanceSlide(slide, index, totalSlides);
    slidesWrapper.append(slide);
  });

  block.textContent = "";
  block.setAttribute("role", "region");
  block.setAttribute("aria-label", "Featured experiences");
  block.append(slidesWrapper);

  // Only initialize slider if there's more than one slide
  if (totalSlides <= 1) {
    // Single slide - just show it, no slider functionality
    slides[0].classList.add("is-active");
    return;
  }

  // Multiple slides - initialize slider
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

  const setActiveSlide = (index) => {
    slides.forEach((slide, idx) => {
      slide.classList.toggle("is-active", idx === index);
    });
    indicatorButtons.forEach((btn, idx) => {
      btn.classList.toggle("is-active", idx === index);
    });

    // Move indicators to the active slide's content panel
    const currentActiveSlide = slides[index];
    if (currentActiveSlide?._contentWrapper) {
      // Remove from previous location if exists
      const existingIndicators =
        currentActiveSlide._contentWrapper.querySelector(
          ".homebanner__indicators"
        );
      if (!existingIndicators) {
        currentActiveSlide._contentWrapper.append(indicatorWrapper);
      }
    }

    // Move controls to active slide
    const previousSlide = slides.find((s) =>
      s.querySelector(".homebanner__controls")
    );
    if (previousSlide) {
      previousSlide.querySelector(".homebanner__controls")?.remove();
    }
    if (
      currentActiveSlide &&
      !currentActiveSlide.querySelector(".homebanner__controls")
    ) {
      currentActiveSlide.append(controls);
    }

    activeIndex = index;
  };

  // Update indicator click handlers
  indicatorButtons.forEach((btn, idx) => {
    btn.addEventListener("click", () => goTo(idx));
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

  setActiveSlide(0);
  startAutoplay();
}
