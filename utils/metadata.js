/**
 * @param {string} name
 * @param {Document} doc
 * @returns {string}
 */
export function getMetadata(name, doc = document) {
  const attr = name && name.includes(":") ? "property" : "name";
  const meta = [...doc.head.querySelectorAll(`meta[${attr}="${name}"]`)]
    .map((m) => m.content)
    .join(", ");
  return meta || "";
}
