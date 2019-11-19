const {loadAMP} = require('./util/loader');

test('AMP iframe uses CSP', async () => {
  const {page, iframe} = await loadAMP();
  await page.setRequestInterception(true);
  page.on('request', req => {
    expect(req.url().startsWith('https://evil.example/')).toBeFalsy();
    req.continue();
  });

  await iframe.waitForSelector('html.i-amphtml-iframed');
  await iframe.evaluate(() => {
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('src', 'https://evil.example/evil.js');
    scriptTag.setAttribute('class', 'evil');

    const imgTag = document.createElement('img');
    imgTag.setAttribute('src', 'https://evil.example/evil.jpg');
    imgTag.setAttribute('class', 'evil');

    const iframeTag = document.createElement('iframe');
    iframeTag.setAttribute('src', 'https://evil.example/iframe');
    iframeTag.setAttribute('class', 'evil');

    document.body.appendChild(scriptTag);
    document.body.appendChild(imgTag);
    document.body.appendChild(iframeTag);
  });
  await iframe.waitForSelector('img.evil, script.evil, iframe.evil');
});
