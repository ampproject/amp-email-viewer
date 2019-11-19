const IFRAME_SELECTOR = '#viewer > iframe';

/**
 * Loads the viewer home page using Puppeteer and injects custom AMP code into
 * it (if provided).
 *
 * @param {string=} code AMP code to inject and render
 * @return {Object} Whether the content type is accepted
 */
async function loadAMP(code = '') {
  await page.evaluateOnNewDocument((code) => {
    window.ampCode = code;
  }, code);
  await page.goto('http://localhost:3000');
  await page.waitForSelector(IFRAME_SELECTOR);
  const iframeElement = await page.$(IFRAME_SELECTOR);
  const iframe = await iframeElement.contentFrame();
  return {
    iframeElement,
    iframe,
    page,
  };
}

module.exports = { loadAMP };
