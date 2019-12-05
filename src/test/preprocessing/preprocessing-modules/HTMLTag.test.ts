import { module as HTMLTag } from '../../../preprocessing/preprocessing-modules/HTMLTag';

describe('HTMLTag module', () => {
  // tslint:disable:no-any
  const config = {} as any;

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
