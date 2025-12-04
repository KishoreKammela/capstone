/**
 * @param {string} path
 * @returns {Promise<Document|null>}
 */
export async function loadFragment(path) {
  if (path && path.startsWith("/")) {
    const resp = await fetch(path);
    if (resp.ok) {
      const parser = new DOMParser();
      return parser.parseFromString(await resp.text(), "text/html");
    }
  }
  return null;
}
