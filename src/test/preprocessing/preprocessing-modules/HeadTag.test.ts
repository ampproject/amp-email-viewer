import { module as HeadTag } from '../../../preprocessing/preprocessing-modules/HeadTag';
import { parseHTMLDocument, serializeHTML } from '../../../util';

describe('HeadTag module', () => {
  // tslint:disable:no-any
  const config = {} as any;

  test('has correct name', () => {
    expect(HeadTag.name).toBe('HeadTag');
  });

  test('injects into <head> tag', () => {
    const doc = parseHTMLDocument(`<!DOCTYPE html>
<html amp4email>
<head>
<meta name="hello" content="hello,world">
</head>
<body>Hello, world!</body>
</html>`);

    HeadTag.processDocument(doc, config);
    expect(serializeHTML(doc)).toBe(`<!DOCTYPE html>
<html amp4email=""><head>
<meta name="hello" content="hello,world">
<meta name="amp-allowed-url-macros" content=""><meta name="amp-action-whitelist" content="*.show,*.hide,*.toggleVisibility,*.toggleClass,*.scrollTo,*.focus,AMP-CAROUSEL.goToSlide,AMP-IMAGE-LIGHTBOX.open,AMP-LIGHTBOX.open,AMP-LIGHTBOX.close,AMP-LIST.changeToLayoutContainer,AMP-LIST.refresh,AMP-SELECTOR.clear,AMP-SELECTOR.selectUp,AMP-SELECTOR.selectDown,AMP-SELECTOR.toggle,AMP-SIDEBAR.open,AMP-SIDEBAR.close,AMP-SIDEBAR.toggle,FORM.clear,FORM.submit,AMP.setState"><script src="https://cdn.ampproject.org/v0/amp-viewer-integration-0.1.js" async=""></script></head>
<body>Hello, world!
</body></html>`);
  });
});
