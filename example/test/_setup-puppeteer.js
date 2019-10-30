const test = require('ava');
const puppeteer = require('puppeteer');
const server = require('../server');

const PORT = 3000;

test.before(async t => {
  const [browser] = await Promise.all([
    puppeteer.launch(),
    server.start(PORT, {
      cache: false,
      watch: false,
    }),
  ]);
  t.context = {
    browser,
    url: `http://localhost:${PORT}`,
  };
});

test.after(async t => {
  const {browser} = t.context;
  await browser.close();
});

test.beforeEach(async t => {
  const {browser} = t.context;
  const page = await browser.newPage();
  await page.goto(t.context.url);
  t.context = Object.assign({}, t.context, {
    page,
  });
});

test.afterEach(async t => {
  const {page} = t.context;
  await page.close();
});
