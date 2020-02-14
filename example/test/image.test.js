const { loadAMP } = require('./util/loader');

const AMP_IMG_CODE = `<!DOCTYPE html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <style amp4email-boilerplate>body{visibility:hidden}</style>
</head>
<body>
  <amp-img src="https://image.example/cat.jpg" layout="fixed" width="10" height="10"></amp-img>
</body>
</html>
`;

test('images are replaced with redirects', async () => {
  const { iframe, requests } = await loadAMP(AMP_IMG_CODE);
  await iframe.waitForSelector('amp-img>img');
  const src = await iframe.evaluate(() =>
    document.querySelector('amp-img>img').getAttribute('src')
  );
  expect(src).toBe('http://localhost:3000/modules/image-proxy?url=https%3A%2F%2Fimage.example%2Fcat.jpg');
  const req = requests.find(req => req.url.startsWith('https://image.example'));
  expect(req).toBeUndefined();
});
