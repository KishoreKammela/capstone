export default function decorate(block) {
  const ul = document.createElement("ul");
  ul.className = "articles__list";

  [...block.children].forEach((row) => {
    const li = document.createElement("li");
    li.className = "articles__item";

    // Create content wrapper
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "articles__content";

    // Process columns: image, title, description
    const cols = [...row.children];
    cols.forEach((col, index) => {
      if (index === 0) {
        // First column is image
        const picture = col.querySelector("picture");
        if (picture) {
          const imageWrapper = document.createElement("div");
          imageWrapper.className = "articles__image";
          imageWrapper.append(picture);
          li.append(imageWrapper);
        }
      } else {
        // Title and description go to content wrapper
        while (col.firstElementChild) {
          const child = col.firstElementChild;
          // h3 becomes title, p becomes description
          if (child.tagName === "H3") {
            child.className = "articles__title";
            contentWrapper.append(child);
          } else if (child.tagName === "P") {
            child.className = "articles__description";
            contentWrapper.append(child);
          } else {
            contentWrapper.append(child);
          }
        }
      }
    });

    // Append content wrapper to li
    if (contentWrapper.children.length > 0) {
      li.append(contentWrapper);
    }

    ul.append(li);
  });

  block.textContent = "";
  block.append(ul);
}
