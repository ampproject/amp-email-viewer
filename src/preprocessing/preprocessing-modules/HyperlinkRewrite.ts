import { Config } from '../../config';
import { parseHTML, serializeHTML } from '../../util';

const HYPERLINK_SELECTOR = 'a[href]';

/**
 * Rewrites all hypterlinks to use target=_blank and the correct rel. Optionally
 * replaces URLs with redirects, if set in the global config.
 *
 * @param {string} amp AMP code to modify hypterlinks inside
 * @param {!Config} config Global config
 * @return {string} Modified AMP code
 */
function process(amp: string, config: Config): string {
  const doc = parseHTML(amp);
  const links = doc.querySelectorAll(HYPERLINK_SELECTOR);
  for (const link of Array.from(links)) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noreferrer noopener');
    if (config.linkRedirectURL) {
      rewriteHyperlink(link, config.linkRedirectURL);
    }
  }
  return serializeHTML(doc);
}

/**
 * Rewrites the href attribute of the given element to use the given redirect.
 *
 * @param {!Element} link HTML element to rewrite href of
 * @param {string} proxy URL of redirect, with %s as placeholder
 */
function rewriteHyperlink(link: Element, redirect: string): void {
  if (redirect.indexOf('%s') === -1) {
    throw new Error('Invalid redirect URL, no placeholder found');
  }
  const url = link.getAttribute('href');
  if (!url) {
    return;
  }
  const proxiedURL = redirect.replace('%s', encodeURIComponent(url));
  link.setAttribute('href', proxiedURL);
  link.setAttribute('title', url);
}

export const module = {
  name: 'HyperlinkRewrite',
  process,
};
