test('demo page works', async () => {
  await page.goto(process.env.DEMO_URL);
  await page.waitForSelector('#viewer > iframe');
});
