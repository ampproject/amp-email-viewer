import { module as HTMLTag } from '../../../preprocessing/preprocessing-modules/HTMLTag';
import { JSDOM } from 'jsdom';

declare global {
  namespace NodeJS {
    interface Global {
      DOMParser: typeof DOMParser;
    }
  }
}

describe('HTMLTag module', () => {
  // tslint:disable:no-any
  const config = {} as any;

  beforeAll(() => {
    const dom = new JSDOM();
    global.DOMParser = dom.window.DOMParser;
  });

  afterAll(() => {
    delete global.DOMParser;
  });

  test('has correct name', () => {
    expect(HTMLTag.name).toBe('HTMLTag');
  });

  test('adds attributes to html tag', () => {
    const code = `<!DOCTYPE html>
<html amp4email>
<head></head>
<body>Hello, world!</body>
</html>`;

    const out = HTMLTag.process(code, config);
    expect(out).toBe(`<!DOCTYPE html>
<html amp4email="" allow-xhr-interception="" allow-viewer-render-template="" report-errors-to-viewer=""><head></head>
<body>Hello, world!
</body></html>`);
  });
});
