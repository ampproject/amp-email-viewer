import { module as ElementLimits } from '../../../preprocessing/preprocessing-modules/ElementLimits';
import { parseHTMLDocument, serializeHTML } from '../../../util';

describe('SizeCheck module', () => {
  // tslint:disable:no-any
  const config = {} as any;

  test('has correct name', () => {
    expect(ElementLimits.name).toBe('ElementLimits');
  });

  test('works when within limits', () => {
    const doc = parseHTMLDocument(`
    <amp-state></amp-state>
    <amp-img></amp-img>
    `);

    const err = ElementLimits.validateDocument(doc, config);
    expect(err).toBeNull();
  });

  test('throws if limit exceeded', () => {
    const doc = parseHTMLDocument(`
    <amp-state></amp-state>
    <amp-state></amp-state>
    <amp-state></amp-state>
    <amp-state></amp-state>
    <amp-state></amp-state>
    <amp-state></amp-state>
    <amp-img></amp-img>
    `);
    const err = ElementLimits.validateDocument(doc, config);
    expect(err).not.toBeNull();
  });
});
