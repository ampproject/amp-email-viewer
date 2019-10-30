const test = require('ava');

const IFRAME_SELECTOR = '#viewer > iframe';

test('AMP runtime loads in iframe', async t => {
  const {page} = t.context;
  await page.waitForSelector(IFRAME_SELECTOR);
  const iframe = await page.$(IFRAME_SELECTOR);
  t.assert(iframe);
  // TODO: check if runtime loaded
});
