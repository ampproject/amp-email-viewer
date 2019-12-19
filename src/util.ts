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

/**
 * Checks if the given URL is a valid HTTPS URL.
 *
 * @param {string} url URL to check
 * @return {boolean} true if the URL is valid
 */
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'localhost' && parsed.protocol !== 'https:') {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Checks if the given URL is a valid HTTPS URL and contains a "%s" placeholder.
 *
 * @param {string} url URL to check
 * @return {boolean} true if the URL is valid and contains placeholder
 */
export function isValidURLWithPlaceholder(url: string): boolean {
  return isValidURL(url) && url.indexOf('%s') > -1;
}

/**
 * Embeds the given URL into the given proxy URL that contains a placeholder.
 *
 * @param {string} url URL to embed
 * @param {string} proxy URL of proxy server, with %s as placeholder
 * @return {string} rewritten URL or empty string if original URL is invalid
 */
export function rewriteURLUsingPlaceholder(url: string, proxy: string): string {
  if (!isValidURL(url)) {
    return '';
  }

  if (!isValidURLWithPlaceholder(proxy)) {
    throw new Error('Invalid proxy URL or no "%s" placeholder found');
  }
  return proxy.replace('%s', encodeURIComponent(url));
}

/**
 * Makes a POST request to the given JSON endpoint and returns a parsed JSON
 * response.
 *
 * @param {string} url URL to make a request to
 * @param {*} data data to include in the body of request (as JSON)
 * @param {Object=} options additional fetch options to include
 * @return {Promise<*>} parsed JSON response from server
 */
export async function postJSON<In, Out>(
  url: string,
  data: In,
  options: RequestInit = {}
): Promise<Out> {
  const opts = Object.assign(
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      redirect: 'error',
      body: JSON.stringify(data),
    },
    options
  );
  const response = await fetch(url, opts);
  return response.json();
}
