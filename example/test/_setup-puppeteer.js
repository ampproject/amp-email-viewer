const test = require('ava');
const puppeteer = require('puppeteer');
const server = require('../server');

const PORT = 3000;
const IFRAME_SELECTOR = '#viewer > iframe';


function initGlobals() {
  if (!global.browser) {
    global.browser = puppeteer.launch();
  }
  if (!global.server) {
    global.server = server.start(PORT, {
      cache: false,
      watch: false,
    });
  }
}

test.before(async t => {
  // `before` runs once per file and we should only have one browser and server
  initGlobals();

  await global.server;
  t.context = {
    browser: await global.browser,
    url: `http://localhost:${PORT}`,
  };
});

test.beforeEach(async t => {
  const {browser} = t.context;
  const page = await browser.newPage();
  await page.goto(t.context.url);
  await page.waitForSelector(IFRAME_SELECTOR);
  const iframeElement = await page.$(IFRAME_SELECTOR);
  const iframe = await iframeElement.contentFrame();

  t.context = Object.assign({}, t.context, {
    page,
    iframeElement,
    iframe,
  });
});

test.afterEach(async t => {
  const {page} = t.context;
  await page.close();
});
