import { Config } from '../../config';
import { parseHTML, serializeHTML } from '../../util';

const SCRIPT_SELECTOR = 'script[src]';
const AMP_CDN_BASE = 'https://cdn.ampproject.org/';

/**
 * Rewrites all script tags that reference the AMP runtime to use either an RTV
 * pin or a custom CDN, depending on the global config.
 *
 * @param {string} amp AMP code to modify scripts in
 * @param {!Config} config Global config
 * @return {string} Modified AMP code
 */
function process(amp: string, config: Config): string {
  if (!config.rtvPin && !config.runtimeCDN) {
    return amp;
  }

  const doc = parseHTML(amp);
  const scripts = doc.querySelectorAll(SCRIPT_SELECTOR);
  for (const script of Array.from(scripts)) {
    rewriteScriptSrc(script, config);
  }
  return serializeHTML(doc);
}

/**
 * Rewrites the script src of the given element to use either an RTV pin or a
 * different CDN.
 *
 * @param {!Element} script script element to rewrite src of
 * @param {!Config} config global config to determine the new CDN
 */
function rewriteScriptSrc(script: Element, config: Config): void {
  const src = script.getAttribute('src');
  if (!src || !src.startsWith(AMP_CDN_BASE)) {
    return;
  }

  let newBase = config.runtimeCDN;
  if (!newBase) {
    newBase = `${AMP_CDN_BASE}rtv/${config.rtvPin}/`;
  }
  const newSrc = src.replace(AMP_CDN_BASE, newBase);
  script.setAttribute('src', newSrc);
}

export const module = {
  name: 'RuntimeRewrite',
  process,
};
