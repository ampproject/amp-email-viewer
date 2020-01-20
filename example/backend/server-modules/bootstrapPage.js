const path = require('path');
const crypto = require('crypto');

/**
 * Host of the page that contains the iframe with the bootstrap page.
 *
 * @const {string}
 */
const { HOST_ORIGIN } = process.env;

/**
 * Host of the CDN that hosts the AMP runtime.
 *
 * @const {string}
 */
const { CDN_ORIGIN } = process.env;

/**
 * Host of the server that used to proxy images (image proxy module).
 *
 * @const {string}
 */
const { IMAGE_PROXY_ORIGIN } = process.env;

/**
 * JS source code of the bootstrap page.
 *
 * @const {string}
 */
const BOOTSTRAP_JS = `function message(event) {
  if (event.data && event.data.amp) {
    window.removeEventListener('message', message);
    document.write(event.data.amp);
    document.close();
  }
}
window.addEventListener('message', message);`;

/** @const {string} */
const BOOTSTRAP_HTML = generateHTMLFromJS(BOOTSTRAP_JS);

/** @const {string[]} */
const CSP_DIRECTIVES = [
  "base-uri 'none'",
  'block-all-mixed-content',
  'child-src blob:',
  `connect-src ${CDN_ORIGIN}`,
  "default-src 'none'",
  "form-action 'none'",
  `frame-ancestors ${HOST_ORIGIN}`,
  "frame-src 'none'",
  'sandbox allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts',
  `script-src ${generateCSPHash(BOOTSTRAP_JS)} ${CDN_ORIGIN}`,
  "style-src 'unsafe-inline'",
  `img-src data: ${IMAGE_PROXY_ORIGIN}`,
  'worker-src blob:',
];

module.exports = async function(req, res) {
  res.set('Content-Security-Policy', CSP_DIRECTIVES.join(';'));
  res.send(BOOTSTRAP_HTML);
};

/**
 * Generates CSP-compatible hashes for the given JS code.
 *
 * @param {string} input JS code to generate CSP hash of.
 * @return {string} CSP hash
 */
function generateCSPHash(input) {
  const hash = crypto.createHash('sha512');
  hash.update(input);
  return `'sha512-${hash.digest('base64')}'`;
}

/**
 * Wraps the given JS code in HTML tags to make it a valid HTML page.
 *
 * @param {string} js JS code to wrap
 * @return {string} HTML code
 */
function generateHTMLFromJS(js) {
  return `<!DOCTYPE html><meta charset="utf-8"><script>${js}</script>`;
}
