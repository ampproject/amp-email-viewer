const { loadAMP } = require('./util/loader');

const AMP_IMG_CODE = `<!DOCTYPE html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <style amp4email-boilerplate>body{visibility:hidden}</style>
</head>
<body>
  <a href="https://example.com/">Link</a>
</body>
</html>
`;

test('links are replaced with redirects', async () => {
  const { iframe, requests } = await loadAMP(AMP_IMG_CODE);
  await iframe.waitForSelector('a');
  const {href, rel} = await iframe.evaluate(() => {
    const el = document.querySelector('a');
    return {
      href: el.getAttribute('href'),
      rel: el.getAttribute('rel')
    };
  });
  expect(href).toBe('http://localhost:3000/modules/link-redirect?url=https%3A%2F%2Fexample.com%2F');
  expect(rel).toBe('noreferrer noopener');
});
