const fetch = require('node-fetch');
const EventEmitter = require('events');

const IFRAME_SELECTOR = '#viewer > iframe';
const RUNTIME_URL = 'https://cdn.ampproject.org/v0.js';
const RUNTIME_CODE = loadRuntime();

/**
 * Loads the viewer home page using Puppeteer and injects custom AMP code into
 * it (if provided).
 *
 * @param {string=} code AMP code to inject and render
 * @return {!Object} Whether the content type is accepted
 */
async function loadAMP(code = '', config = {}) {
  const requests = await interceptRequests(page);

  await page.evaluateOnNewDocument((code, config) => {
    window.ampCode = code;
    window.ampContainerConfig = config;
  }, code, config);
  await page.goto('http://localhost:3000');
  await page.waitForSelector(IFRAME_SELECTOR);
  const iframeElement = await page.$(IFRAME_SELECTOR);
  const iframe = await iframeElement.contentFrame();
  return {
    iframeElement,
    iframe,
    page,
    requests
  };
}

async function interceptRequests(page) {
  const runtimeCode = await RUNTIME_CODE;
  await page.setRequestInterception(true);
  const requests = new EventEmitter();
  page.removeAllListeners('request');
  page.on('request', req => {
    requests.emit('request', {
      url: req.url(),
      method: req.method(),
      headers: req.headers(),
      postData: req.postData(),
    });

    if (req.url() === RUNTIME_URL) {
      req.respond({
        status: 200,
        contentType: 'text/javascript',
        body: runtimeCode,
      });
      return;
    }
    req.continue();
  });
  return requests;
}

async function loadRuntime() {
  const code = await (await fetch(RUNTIME_URL)).text();

  // Hacky way to ensure localhost is trusted in our tests.
  // URLs starting with the "x-thread:" protocol are always trusted. By changing
  // to "http:", we allow http://localhost to be trusted.
  return code.replace('x-thread:', 'http:');
}

module.exports = { loadAMP };
