import { Config } from '../../config';
import {
  parseHTML,
  serializeHTML,
  rewriteURLUsingPlaceholder,
} from '../../util';

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

    // The validator shouldn't allow this, so this is just a safeguard.
    if (img.hasAttribute('srcset')) {
      img.removeAttribute('srcset');
    }

    if (!src || src.match(MUSTACHE_TEMPLATE_REGEX)) {
      continue;
    }
    img.setAttribute(
      'src',
      rewriteURLUsingPlaceholder(src, config.imageProxyURL)
    );
  }
  return serializeHTML(doc);
}

export const module = {
  name: 'ImageURLRewrite',
  process,
};
