const server = require('../../server');
const { setup: setupPuppeteer } = require('jest-environment-puppeteer')

module.exports = async function(config) {
  global.__SERVER__ = await server.start(3000, {
    cache: false,
    watch: false,
  });
  await setupPuppeteer(config);
};
