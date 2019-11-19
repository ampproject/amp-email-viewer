const { teardown: teardownPuppeteer } = require('jest-environment-puppeteer')

module.exports = async function(config) {
  global.__SERVER__.close();
  await teardownPuppeteer(config);
}
