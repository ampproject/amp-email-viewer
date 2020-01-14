import { Config } from '../../config';
import { DocumentPreprocessingModule } from './index';

const HYPERLINK_SELECTOR = 'a[href]';

/**
 * Rewrites all hypterlinks to use target=_blank and the correct rel. Optionally
 * replaces URLs with redirects, if set in the global config.
 *
 * @param {!Document} doc AMP document to modify hypterlinks inside
 * @param {!Config} config Global config
 */
function process(doc: DocumentFragment, config: Config) {
  const links = doc.querySelectorAll(HYPERLINK_SELECTOR);
  for (const link of Array.from(links)) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noreferrer noopener');
    if (config.linkRedirectURL) {
      rewriteHyperlink(link, config.linkRedirectURL);
    }
  }
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

export const module: DocumentPreprocessingModule = {
  name: 'HyperlinkRewrite',
  processDocument: process,
};
