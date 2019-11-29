import { module as RuntimeRewrite } from '../../../preprocessing/preprocessing-modules/RuntimeRewrite';
import { JSDOM } from 'jsdom';

declare global {
  namespace NodeJS {
    interface Global {
      DOMParser: typeof DOMParser;
    }
  }
}

describe('RuntimeRewrite module', () => {
  beforeAll(() => {
    const dom = new JSDOM();
    global.DOMParser = dom.window.DOMParser;
  });

  afterAll(() => {
    delete global.DOMParser;
  });

  test('has correct name', () => {
    expect(RuntimeRewrite.name).toBe('RuntimeRewrite');
  });

  test('rewrites scripts to use RTV pin', () => {
    const code = `<!DOCTYPE html>
<html amp4email>
<head>
<script async src="https://cdn.ampproject.org/v0.js"></script>
<script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
</head>
<body>
Hello, world!
</body>
</html>`;

    // tslint:disable:no-any
    const out = RuntimeRewrite.process(code, {
      rtvPin: '011911121900560',
    } as any);
    expect(out).toBe(`<!DOCTYPE html>
<html amp4email=""><head>
<script async="" src="https://cdn.ampproject.org/rtv/011911121900560/v0.js"></script>
<script async="" custom-element="amp-anim" src="https://cdn.ampproject.org/rtv/011911121900560/v0/amp-anim-0.1.js"></script>
</head>
<body>
Hello, world!

</body></html>`);
  });

  test('rewrites scripts to use different CDN', () => {
    const code = `<!DOCTYPE html>
<html amp4email>
<head>
<script async src="https://cdn.ampproject.org/v0.js"></script>
<script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
</head>
<body>
Hello, world!
</body>
</html>`;

    // tslint:disable:no-any
    const out = RuntimeRewrite.process(code, {
      runtimeCDN: 'https://cdn.example/amp/',
    } as any);
    expect(out).toBe(`<!DOCTYPE html>
<html amp4email=""><head>
<script async="" src="https://cdn.example/amp/v0.js"></script>
<script async="" custom-element="amp-anim" src="https://cdn.example/amp/v0/amp-anim-0.1.js"></script>
</head>
<body>
Hello, world!

</body></html>`);
  });
});
