import * as Bowser from 'bowser';
import { Config } from '../../config';
import { TextPreprocessingModule } from './index';

/**
 * Based on:
 * - https://caniuse.com/#feat=mdn-http_headers_csp_content-security-policy
 * - https://caniuse.com/#feat=mdn-http_headers_csp_content-security-policy_worker-src (most recent CSP feature used)
 * - https://caniuse.com/#feat=rel-noopener
 * - https://caniuse.com/#feat=rel-noreferrer
 * - https://caniuse.com/#feat=iframe-sandbox
 * - https://caniuse.com/#feat=mdn-html_elements_iframe_sandbox-allow-popups-to-escape-sandbox (most recent sandbox feature used)
 * - https://caniuse.com/#feat=mdn-api_htmlframeelement_contentwindow
 * - https://caniuse.com/#feat=url
 * - https://caniuse.com/#feat=getrandomvalues
 */
const BROWSER_REQUIREMENTS = {
  chrome: '>=59',
  firefox: '>=58',
  opera: '>=48',
  safari: '>=10.1',
  ios: {
    safari: '>=10.3',
  },
};

/**
 * Throws if the current browser lacks the required capabilities to safely
 * render AMP for Email.
 *
 * Browser detection is used since features like CSP can't be easily detected
 * via feature detection.
 *
 * @param {string} amp AMP code
 * @param {!Config} config Global config (unused)
 * @return {string} AMP code
 */
function process(amp: string, config: Config): string {
  const browser = Bowser.getParser(window.navigator.userAgent);
  if (!browser.satisfies(BROWSER_REQUIREMENTS)) {
    throw new Error('Unsupported browser');
  }
  return amp;
}

export const module: TextPreprocessingModule = {
  name: 'BrowserDetection',
  processText: process,
};
