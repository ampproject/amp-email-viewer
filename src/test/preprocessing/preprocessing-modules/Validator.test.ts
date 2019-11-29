import { module as Validator } from '../../../preprocessing/preprocessing-modules/Validator';
import { JSDOM } from 'jsdom';

declare global {
  namespace NodeJS {
    interface Global {
      window: Window;
      document: Document;
    }
  }
}

describe('Validator module', () => {
  // tslint:disable:no-any
  const config = {} as any;

  beforeAll(() => {
    const dom = new JSDOM('', {
      runScripts: 'dangerously',
      resources: 'usable',
    });
    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterAll(() => {
    delete global.window;
    delete global.document;
  });

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

    const out = await Validator.process(code, config);
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
    <body><img src="test"></body>
    </html>`;

    await expect(Validator.process(code, config)).rejects.toThrow(
      'AMP validation failed'
    );
  });
});
