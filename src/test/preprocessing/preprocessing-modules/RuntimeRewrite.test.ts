import { module as RuntimeRewrite } from '../../../preprocessing/preprocessing-modules/RuntimeRewrite';
import { parseHTMLDocument, serializeHTML } from '../../../util';

describe('RuntimeRewrite module', () => {
  test('has correct name', () => {
    expect(RuntimeRewrite.name).toBe('RuntimeRewrite');
  });

  test('rewrites scripts to use RTV pin', () => {
    const doc = parseHTMLDocument(`<!DOCTYPE html>
<html amp4email>
<head>
<script async src="https://cdn.ampproject.org/v0.js"></script>
<script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
</head>
<body>
Hello, world!
</body>
</html>`);

    // tslint:disable:no-any
    RuntimeRewrite.processDocument(doc, {
      rtvPin: '011911121900560',
    } as any);
    expect(serializeHTML(doc)).toBe(`<!DOCTYPE html>
<html amp4email=""><head>
<script async="" src="https://cdn.ampproject.org/rtv/011911121900560/v0.js"></script>
<script async="" custom-element="amp-anim" src="https://cdn.ampproject.org/rtv/011911121900560/v0/amp-anim-0.1.js"></script>
</head>
<body>
Hello, world!

</body></html>`);
  });

  test('rewrites scripts to use different CDN', () => {
    const doc = parseHTMLDocument(`<!DOCTYPE html>
<html amp4email>
<head>
<script async src="https://cdn.ampproject.org/v0.js"></script>
<script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
</head>
<body>
Hello, world!
</body>
</html>`);

    // tslint:disable:no-any
    RuntimeRewrite.processDocument(doc, {
      runtimeCDN: 'https://cdn.example/amp/',
    } as any);
    expect(serializeHTML(doc)).toBe(`<!DOCTYPE html>
<html amp4email=""><head>
<script async="" src="https://cdn.example/amp/v0.js"></script>
<script async="" custom-element="amp-anim" src="https://cdn.example/amp/v0/amp-anim-0.1.js"></script>
</head>
<body>
Hello, world!

</body></html>`);
  });
});
