export const AUTOPLAY_DELAY = 5000;

/**
 * @param {HTMLElement} slide
 * @param {number} slideIndex
 * @param {number} totalSlides
 */
export function enhanceSlide(slide, slideIndex, totalSlides) {
  const cols = [...slide.children];
  if (!cols.length) return;

  const mediaWrapper = document.createElement("div");
  mediaWrapper.className = "carousel__media";

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "carousel__content";

  cols.forEach((col, index) => {
    const classes = ["image", "text"];
    if (col.children[index] !== undefined) {
      col.children[index].classList.add(`carousel-${classes[index]}`);
    }
    if (index === 0) {
      const picture = col.querySelector("picture");
      if (picture) {
        const img = picture.querySelector("img");
        if (img && !img.getAttribute("alt")) {
          img.setAttribute("alt", `Carousel slide ${slideIndex + 1} image`);
        }
        mediaWrapper.append(picture);
      }
    } else {
      while (col.firstElementChild) {
        const child = col.firstElementChild;
        const link = child.tagName === "A" ? child : child.querySelector("a");
        if (link && link.closest("h2") === null) {
          if (child.tagName === "P") {
            child.classList.add("button-container");
          } else {
            const buttonContainer = document.createElement("p");
            buttonContainer.classList.add("button-container");
            col.removeChild(child);
            buttonContainer.append(child);
            child = buttonContainer;
          }
          const linkText =
            link.textContent || link.getAttribute("title") || "Learn more";
          if (!link.getAttribute("title")) {
            link.setAttribute("title", linkText);
          }
          link.classList.add("button", "primary");
        }
        contentWrapper.append(child);
      }
    }
  });

  slide.textContent = "";
  slide.append(mediaWrapper, contentWrapper);

  slide._contentWrapper = contentWrapper;
  slide.classList.add("carousel__slide");
  slide.setAttribute("role", "group");
  slide.setAttribute("aria-roledescription", "slide");
  slide.setAttribute("aria-label", `Slide ${slideIndex + 1} of ${totalSlides}`);
  slide.setAttribute("aria-hidden", "true");
}

/**
 * @param {HTMLElement[]} slides
 * @param {Function} switchSlide
 * @returns {HTMLElement}
 */
export function buildIndicators(slides, switchSlide) {
  const indicators = document.createElement("div");
  indicators.className = "carousel__indicators";
  indicators.setAttribute("role", "tablist");
  indicators.setAttribute("aria-label", "Slide indicators");

  slides.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "carousel__indicator";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-label", `Go to slide ${index + 1}`);
    button.setAttribute("aria-selected", index === 0 ? "true" : "false");
    button.setAttribute("tabindex", index === 0 ? "0" : "-1");
    button.addEventListener("click", () => switchSlide(index));
    indicators.append(button);
  });

  return indicators;
}

/**
 * @param {Function} prevHandler
 * @param {Function} nextHandler
 * @returns {HTMLElement}
 */
export function buildControls(prevHandler, nextHandler) {
  const controls = document.createElement("div");
  controls.className = "carousel__controls";

  const prev = document.createElement("button");
  prev.type = "button";
  prev.className = "carousel__control carousel__control--prev";
  prev.setAttribute("aria-label", "Previous slide");
  prev.setAttribute("aria-controls", "carousel");
  prev.addEventListener("click", prevHandler);
  prev.innerHTML = "&larr;";

  const next = document.createElement("button");
  next.type = "button";
  next.className = "carousel__control carousel__control--next";
  next.setAttribute("aria-label", "Next slide");
  next.setAttribute("aria-controls", "carousel");
  next.addEventListener("click", nextHandler);
  next.innerHTML = "&rarr;";

  controls.append(prev, next);
  return controls;
}
