import { loadFragment } from "../../utils/fragment.js";
import { getMetadata } from "../../utils/metadata.js";

/**
 * @param {HTMLElement} block The featured article block element
 */
export default async function decorate(block) {
  const link = block.querySelector("a");
  const path = link ? link.getAttribute("href") : block.textContent.trim();
  const doc = await loadFragment(path);
  if (!doc) {
    return;
  }

  const title = getMetadata("og:title", doc);
  const desc = getMetadata("og:description", doc);

  const categoryElement = document.createElement("p");
  categoryElement.classList.add("featured-article__category");
  categoryElement.textContent = "Featured Article";

  const titleElement = document.createElement("h2");
  titleElement.textContent = title;

  const descriptionElement = document.createElement("p");
  descriptionElement.textContent = desc;

  const buttonContainer = document.createElement("p");
  buttonContainer.classList.add("button-container");
  buttonContainer.append(link);
  link.textContent = "Read More";
  link.className = "button primary";
  link.setAttribute("aria-label", `Read more about ${title}`);

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("featured-article__content");
  contentContainer.append(
    categoryElement,
    titleElement,
    descriptionElement,
    buttonContainer
  );

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("featured-article__image");
  const heroPicture = doc.querySelector("body > main picture");
  if (heroPicture) {
    const img = heroPicture.querySelector("img");
    if (img && !img.getAttribute("alt")) {
      img.setAttribute("alt", title || "Featured article image");
    }
    imageContainer.append(heroPicture);
  }

  block.setAttribute("role", "article");
  block.setAttribute("aria-label", "Featured article");
  block.replaceChildren(imageContainer, contentContainer);
}
