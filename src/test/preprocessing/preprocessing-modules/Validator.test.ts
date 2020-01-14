import { module as Validator } from '../../../preprocessing/preprocessing-modules/Validator';

describe('Validator module', () => {
  // tslint:disable:no-any
  const config = {} as any;

  test('has correct name', () => {
    expect(Validator.name).toBe('Validator');
  });

  test('works on valid AMP', async () => {
    const code = `<!doctype html>
    <html ⚡4email>
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <style amp4email-boilerplate>body{visibility:hidden}</style>
    </head>
    <body>Hello</body>
    </html>`;

    const out = await Validator.processText(code, config);
    expect(out).toBe(code);
  });

  test('throws on invalid AMP', async () => {
    const code = `<!doctype html>
    <html ⚡4email>
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <style amp4email-boilerplate>body{visibility:hidden}</style>
    </head>
    <body>
      <!-- The <img> tag is not allowed in AMP -->
      <img src="test">
    </body>
    </html>`;

    await expect(Validator.processText(code, config)).rejects.toThrow(
      'AMP validation failed'
    );
  });

  test('throws on valid AMP for another format', async () => {
    const code = `<!doctype html>
    <html ⚡>
    <head>
      <meta charset="utf-8">
      <link rel="canonical" href="self.html">
      <meta name="viewport" content="width=device-width,minimum-scale=1">
      <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
      <script async src="https://cdn.ampproject.org/v0.js"></script>
    </head>
    <body>Hello</body>
    </html>`;

    await expect(Validator.processText(code, config)).rejects.toThrow(
      'AMP validation failed'
    );
  });
});
