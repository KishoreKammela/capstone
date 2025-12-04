/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const ul = document.createElement("ul");
  ul.className = "articles__list";
  ul.setAttribute("role", "list");

  [...block.children].forEach((row, rowIndex) => {
    const li = document.createElement("li");
    li.className = "articles__item";
    li.setAttribute("role", "listitem");

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "articles__content";

    const cols = [...row.children];
    cols.forEach((col, index) => {
      if (index === 0) {
        const picture = col.querySelector("picture");
        if (picture) {
          const imageWrapper = document.createElement("div");
          imageWrapper.className = "articles__image";
          const img = picture.querySelector("img");
          if (img && !img.getAttribute("alt")) {
            img.setAttribute("alt", `Article ${rowIndex + 1} image`);
          }
          imageWrapper.append(picture);
          li.append(imageWrapper);
        }
      } else {
        while (col.firstElementChild) {
          const child = col.firstElementChild;
          child.className = "";
          if (child.tagName === "H3") {
            child.classList.add("articles__title");
            contentWrapper.append(child);
          } else if (child.tagName === "P") {
            const link = child.querySelector("a");
            if (link && link.closest("h2, h3") === null) {
              if (!child.classList.contains("button-container")) {
                child.classList.add("button-container");
              }
              const linkText =
                link.textContent || link.getAttribute("title") || "Learn more";
              if (!link.getAttribute("title")) {
                link.setAttribute("title", linkText);
              }
              link.classList.add("button", "primary");
            } else {
              child.classList.add("articles__description");
            }
            contentWrapper.append(child);
          } else {
            contentWrapper.append(child);
          }
        }
      }
    });

    if (contentWrapper.children.length > 0) {
      li.append(contentWrapper);
    }

    ul.append(li);
  });

  block.setAttribute("role", "region");
  block.setAttribute("aria-label", "Article cards");
  block.textContent = "";
  block.append(ul);
}
