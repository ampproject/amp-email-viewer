const { loadAMP } = require('./util/loader');

const AMP_BIND_CODE = `<!DOCTYPE html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-bind" src="https://cdn.ampproject.org/v0/amp-bind-0.1.js"></script>
  <style amp4email-boilerplate>body{visibility:hidden}</style>
</head>
<body>
  <button on="tap:AMP.setState({state: 'clicked'})">Click</button>
  <div id="output" [class]="state || ''"></div>
</body>
</html>
`;

test('amp-bind works correctly', async () => {
  const { page, iframe } = await loadAMP(AMP_BIND_CODE);
  const button = await iframe.$('button');
  expect(await iframe.$eval('#output', (output) => output.className)).toBe('');
  await button.click();
  await iframe.waitForSelector('#output.clicked');
});
