const { loadAMP } = require('./util/loader');

test('AMP runtime loads in iframe', async () => {
  const { iframe } = await loadAMP();
  await iframe.waitForSelector('html.i-amphtml-iframed');
});

test('page loading timeout', async () => {
  const { iframe } = await loadAMP('not AMP');
  await iframe.waitForSelector('pre');
  const body = await iframe.evaluate(() => document.body.innerText);
  expect(body).toBe('Error loading AMP page.\nLoading timeout');
});
