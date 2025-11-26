export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cols = [...row.children];
  if (!cols.length) return;

  // Create content container (first - for mobile stacking)
  const contentContainer = document.createElement("div");
  contentContainer.className = "articlecard__content";

  // Create image container (second - for mobile stacking)
  const imageContainer = document.createElement("div");
  imageContainer.className = "articlecard__image";

  // Process each column
  cols.forEach((col, index) => {
    // First column is image
    if (index === 0) {
      const picture = col.querySelector("picture");
      if (picture) {
        imageContainer.append(picture);
      }
    } else {
      // All other columns go to content container
      let titleFound = false;
      while (col.firstElementChild) {
        const child = col.firstElementChild;
        // Add classes for proper styling
        if (child.tagName === "H3") {
          // First h3 is category/label
          if (!contentContainer.querySelector("h3, h4")) {
            child.className = "articlecard__category";
          } else {
            // Subsequent h3 is title
            child.className = "articlecard__title";
            titleFound = true;
          }
        } else if (child.tagName === "P") {
          // First p (without button) after category is title, rest are description
          if (!titleFound && !child.querySelector("a.button")) {
            child.className = "articlecard__title";
            titleFound = true;
          } else if (!child.querySelector("a.button")) {
            child.className = "articlecard__description";
          }
        }
        contentContainer.append(child);
      }
    }
  });

  // Clear block and add containers
  block.textContent = "";
  block.append(contentContainer);
  block.append(imageContainer);
}
