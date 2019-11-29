/**
 * Parses the HTML and returns the DOM tree.
 *
 * @param {string} html HTML code to parse
 * @return {!HTMLDocument} DOM tree
 */
export function parseHTML(html: string): HTMLDocument {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

/**
 * Serializes the DOM into an HTML string.
 *
 * @param {!HTMLDocument} doc DOM tree to serialize
 * @return {string} HTML code
 */
export function serializeHTML(doc: HTMLDocument): string {
  return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
}
