import { parseHTML, serializeHTML } from '../../preprocessing/util';
import { JSDOM } from 'jsdom';

declare global {
  namespace NodeJS {
    interface Global {
      DOMParser: typeof DOMParser;
    }
  }
}

describe('preprocessing util', () => {
  const html = `<!DOCTYPE html>
<html><head>
<script src="something.js"></script>
</head>
<body data-test="foo">
<img src="something.jpg">

</body></html>`;

  beforeAll(() => {
    const dom = new JSDOM();
    global.DOMParser = dom.window.DOMParser;
  });

  afterAll(() => {
    delete global.DOMParser;
  });

  test('parseHTML returns DOM', () => {
    const parsed = parseHTML(html);
    const body = parsed.querySelector('body');
    expect(body).toBeTruthy();
    expect(body!.getAttribute('data-test')).toBe('foo');
  });

  test('serializeHTML serializes output from parseHTML', () => {
    const serialized = serializeHTML(parseHTML(html));
    expect(serialized).toBe(html);
  });
});
