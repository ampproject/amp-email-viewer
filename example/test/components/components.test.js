const { loadAMP } = require('../util/loader');
const testdata = require('./testdata');

describe('component tests', () => {
  for (const component of testdata) {
    test(component.name, async () => {
      const { page, iframe } = await loadAMP(component.code);
      if (component.loadSelector) {
        await iframe.waitForSelector(component.loadSelector);
      }
      await page.waitFor(1000);
      if (component.clickSelector) {
        const clickers = await iframe.$$(component.clickSelector);
        for (const clicker of clickers) {
          await clicker.click();
        }
      }
      await iframe.waitFor(component.success, {
        polling: 'mutation',
        visible: true,
      });
    });
  }
});
