import { Config } from '../../config';
import { parseHTML, serializeHTML } from '../util';

const IMAGE_ELEMENT_SELECTOR = 'amp-img,amp-anim';
const MUSTACHE_TEMPLATE_REGEX = /^{{\s*[\w\.]+\s*}}$/;

/**
 * Rewrites all images (amp-img and amp-anim) to use the proxy server from the
 * config, if set.
 *
 * @param {string} amp AMP code to modify images inside
 * @param {!Config} config Global config
 * @return {string} Modified AMP code
 */
function process(amp: string, config: Config): string {
  // Only relevant if image proxying is enabled
  if (!config.imageProxyURL) {
    return amp;
  }

  const doc = parseHTML(amp);
  const images = doc.querySelectorAll(IMAGE_ELEMENT_SELECTOR);
  for (const img of Array.from(images)) {
    const src = img.getAttribute('src');
    if (!src || src.match(MUSTACHE_TEMPLATE_REGEX)) {
      continue;
    }
    img.setAttribute('src', rewriteImageURL(src, config.imageProxyURL));
  }
  return serializeHTML(doc);
}

/**
 * Rewrites the image URL attribute to use the given proxy URL.
 *
 * @param {string} url Image URL to rewrite
 * @param {string} proxy URL of proxy server, with %s as placeholder
 */
export function rewriteImageURL(url: string, proxy: string): string {
  // return empty string if the URL is not valid
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return '';
    }
  } catch (e) {
    return '';
  }

  if (proxy.indexOf('%s') === -1) {
    throw new Error('Invalid proxy URL, no placeholder found');
  }
  return proxy.replace('%s', encodeURIComponent(url));
}

export const module = {
  name: 'ImageURLRewrite',
  process,
};
