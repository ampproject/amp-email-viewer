const path = require('path');
const crypto = require('crypto');

const HOST_ORIGIN = 'http://localhost:3000';
const IMAGE_PROXY_ORIGIN = 'http://localhost:3000';

const BOOTSTRAP_JS = `function message(event) {
  if (event.data && event.data.amp) {
    window.removeEventListener('message', message);
    document.write(event.data.amp);
    document.close();
  }
}
window.addEventListener('message', message);`;

const BOOTSTRAP_HTML = generateHTMLFromJS(BOOTSTRAP_JS);

const CSP_DIRECTIVES = [
  "default-src 'none'",
  `script-src ${generateCSPHash(BOOTSTRAP_JS)} https://cdn.ampproject.org`,
  "style-src 'unsafe-inline'",
  `img-src data: ${HOST_ORIGIN}`,
  "frame-src 'none'",
  'connect-src https://cdn.ampproject.org/rtv/',
  'sandbox allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts',
  "base-uri 'none'",
  'child-src blob:',
  "form-action 'none'",
  `frame-ancestors ${HOST_ORIGIN}`,
  'block-all-mixed-content',
  'worker-src blob:',
];

module.exports = async function(req, res) {
  res.set('Content-Security-Policy', CSP_DIRECTIVES.join(';'));
  res.send(BOOTSTRAP_HTML);
};

function generateCSPHash(input) {
  const hash = crypto.createHash('sha512');
  hash.update(input);
  return `'sha512-${hash.digest('base64')}'`;
}

function generateHTMLFromJS(js) {
  return `<!doctype html><meta charset="utf-8"><script>${js}</script>`;
}
