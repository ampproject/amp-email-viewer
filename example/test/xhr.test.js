const { loadAMP } = require('./util/loader');

const AMP_LIST_CODE = `<!DOCTYPE html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-list" src="https://cdn.ampproject.org/v0/amp-list-0.1.js"></script>
  <script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"></script>
  <style amp4email-boilerplate>body{visibility:hidden}</style>
</head>
<body>
  <amp-list layout="fixed-height" height="100" src="https://amp.dev/static/samples/json/cart.json">
    <template type="amp-mustache"></template>
  </amp-list>
</body>
</html>
`;

test('XHR interception is used', async () => {
  const { page } = await loadAMP(AMP_LIST_CODE, {
    templateProxyURL: null,
  });
  const req = await page.waitForRequest(process.env.CONFIG_XHR_PROXY_URL);
  const originalReq = JSON.parse(req.postData()).originalRequest;
  expect(originalReq.input.startsWith('https://amp.dev/static/samples/json/cart.json')).toBeTruthy();
});
