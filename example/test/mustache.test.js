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
    <template type="amp-mustache">
      <div>
        {{#cart_items}}
        <p>{{name}}</p>
        {{/cart_items}}
      </div>
    </template>
  </amp-list>
</body>
</html>
`;

test('Viewer render proxy is used', async () => {
  const { iframe, requests } = await loadAMP(AMP_LIST_CODE);
  await iframe.waitForSelector('amp-list>div[role=list]>div[role=listitem]');
  const req = requests.find(
    req => req.url === process.env.CONFIG_TEMPLATE_PROXY_URL
  );
  expect(req).not.toBeUndefined();
  const originalReq = JSON.parse(req.postData).originalRequest;
  expect(
    originalReq.input.startsWith(
      'https://amp.dev/static/samples/json/cart.json'
    )
  ).toBeTruthy();
  const rendered = await iframe.evaluate(() =>
    document
      .querySelector('amp-list>div[role=list]>div[role=listitem]')
      .innerHTML.replace(/\s+/g, ' ')
      .trim()
  );
  expect(rendered).toBe('<p>Pluot</p> <p>Apple</p>');
});
