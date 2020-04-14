const { loadAMP } = require('../util/loader');

test('AMP iframe uses CSP', async () => {
  const { page, iframe, requests } = await loadAMP();
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
  expect(
    requests.filter(req => req.url.startsWith('https://evil.example/'))
  ).toHaveLength(0);
});
