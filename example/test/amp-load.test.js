const {loadAMP} = require('./util/loader');

test('AMP runtime loads in iframe', async () => {
  const {iframe} = await loadAMP();
  await iframe.waitForSelector('html.i-amphtml-iframed');
});
