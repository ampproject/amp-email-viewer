import { Config } from '../../config';
import { parseHTML, serializeHTML } from '../../util';

const VIEWER_INTEGRATION_SCRIPT =
  'https://cdn.ampproject.org/v0/amp-viewer-integration-0.1.js';
const ALLOWED_URL_MACROS: string[] = [];
const ALLOWED_AMP_ACTIONS = [
  '*.show',
  '*.hide',
  '*.toggleVisibility',
  '*.toggleClass',
  '*.scrollTo',
  '*.focus',
  'AMP-CAROUSEL.goToSlide',
  'AMP-IMAGE-LIGHTBOX.open',
  'AMP-LIGHTBOX.open',
  'AMP-LIGHTBOX.close',
  'AMP-LIST.changeToLayoutContainer',
  'AMP-LIST.refresh',
  'AMP-SELECTOR.clear',
  'AMP-SELECTOR.selectUp',
  'AMP-SELECTOR.selectDown',
  'AMP-SELECTOR.toggle',
  'AMP-SIDEBAR.open',
  'AMP-SIDEBAR.close',
  'AMP-SIDEBAR.toggle',
  'FORM.clear',
  'FORM.submit',
  'AMP.setState',
];

/**
 * Adds <meta> tags and the AMP viewer integration script into the <head> tag of
 * the AMP document.
 *
 * @param {string} amp AMP code to modify <head> tag of
 * @param {!Config} config Global config
 * @return {string} Modified AMP code
 */
function process(amp: string, config: Config): string {
  const doc = parseHTML(amp);

  const tags = doc.getElementsByTagName('head');
  if (tags.length !== 1) {
    throw new Error('Failed to find <head> tag inside AMP document');
  }
  const head = tags[0];

  head.appendChild(
    createMetaTag('amp-allowed-url-macros', ALLOWED_URL_MACROS.join(','))
  );
  head.appendChild(
    createMetaTag('amp-action-whitelist', ALLOWED_AMP_ACTIONS.join(','))
  );
  head.appendChild(createScriptTag(VIEWER_INTEGRATION_SCRIPT));

  return serializeHTML(doc);
}

/**
 * Creates a <meta> tag with the given name and content.
 *
 * @param {string} name meta name
 * @param {string} content meta content
 * @return {!HTMLMetaElement} Newly created <meta> element
 */
function createMetaTag(name: string, content: string): HTMLMetaElement {
  const meta = document.createElement('meta');
  meta.setAttribute('name', name);
  meta.setAttribute('content', content);
  return meta;
}

/**
 * Creates an async <script> tag with the given src.
 *
 * @param {string} src URL of JavaScript to load
 * @return {!HTMLMetaElement} Newly created <script> element
 */
function createScriptTag(src: string): HTMLScriptElement {
  const script = document.createElement('script');
  script.setAttribute('src', src);
  script.setAttribute('async', '');
  return script;
}

export const module = {
  name: 'HeadTag',
  process,
};
