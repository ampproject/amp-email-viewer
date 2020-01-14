import { module as HyperlinkRewrite } from '../../../preprocessing/preprocessing-modules/HyperlinkRewrite';
import { parseHTMLDocument, serializeHTML } from '../../../util';

describe('HyperlinkRewrite module', () => {
  test('has correct name', () => {
    expect(HyperlinkRewrite.name).toBe('HyperlinkRewrite');
  });

  test('adds hyperlink attributes', () => {
    const doc = parseHTMLDocument(`<!DOCTYPE html>
<html amp4email>
<head></head>
<body>
<a href="https://external.example/url">Hello</a>
<a href="https://external.example/other" target="_top">Hello</a>
</body>
</html>`);

    // tslint:disable:no-any
    HyperlinkRewrite.processDocument(doc, {} as any);
    expect(serializeHTML(doc)).toBe(`<!DOCTYPE html>
<html amp4email=""><head></head>
<body>
<a href="https://external.example/url" target="_blank" rel="noreferrer noopener">Hello</a>
<a href="https://external.example/other" target="_blank" rel="noreferrer noopener">Hello</a>

</body></html>`);
  });

  test('adds hyperlink attributes and changes href', () => {
    const doc = parseHTMLDocument(`<!DOCTYPE html>
<html amp4email>
<head></head>
<body>
<a href="https://external.example/url">Hello</a>
<a href="https://external.example/other" target="_top">Hello</a>
</body>
</html>`);

    // tslint:disable:no-any
    HyperlinkRewrite.processDocument(doc, {
      linkRedirectURL: 'https://redirect.example/goto?url=%s',
    } as any);
    expect(serializeHTML(doc)).toBe(`<!DOCTYPE html>
<html amp4email=""><head></head>
<body>
<a href="https://redirect.example/goto?url=https%3A%2F%2Fexternal.example%2Furl" target="_blank" rel="noreferrer noopener" title="https://external.example/url">Hello</a>
<a href="https://redirect.example/goto?url=https%3A%2F%2Fexternal.example%2Fother" target="_blank" rel="noreferrer noopener" title="https://external.example/other">Hello</a>

</body></html>`);
  });
});
