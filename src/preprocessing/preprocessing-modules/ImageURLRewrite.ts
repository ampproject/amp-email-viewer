import { Config } from '../../config';
import { parseHTML, serializeHTML } from '../util';

const IMAGE_ELEMENT_SELECTOR = 'amp-img,amp-anim';

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
    rewriteImageURL(img, config.imageProxyURL);
  }
  return serializeHTML(doc);
}

/**
 * Rewrites the src attribute of the given element to use the given proxy URL.
 *
 * @param {!Element} img HTML element to rewrite src of
 * @param {string} proxy URL of proxy server, with %s as placeholder
 */
function rewriteImageURL(img: Element, proxy: string): void {
  if (proxy.indexOf('%s') === -1) {
    throw new Error('Invalid proxy URL, no placeholder found');
  }
  const url = img.getAttribute('src');
  if (!url) {
    return;
  }
  const proxiedURL = proxy.replace('%s', encodeURIComponent(url));
  img.setAttribute('src', proxiedURL);
}

export const module = {
  name: 'ImageURLRewrite',
  process,
};
