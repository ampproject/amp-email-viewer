import { module as ElementLimits } from '../../../preprocessing/preprocessing-modules/ElementLimits';

describe('SizeCheck module', () => {
  // tslint:disable:no-any
  const config = {} as any;

  test('has correct name', () => {
    expect(ElementLimits.name).toBe('ElementLimits');
  });

  test('works when within limits', () => {
    const code = `
    <amp-state></amp-state>
    <amp-img></amp-img>
    `;

    const out = ElementLimits.process(code, config);
    expect(out).toBe(code);
  });

  test('throws if limit exceeded', () => {
    const code = `
    <amp-state></amp-state>
    <amp-state></amp-state>
    <amp-state></amp-state>
    <amp-state></amp-state>
    <amp-state></amp-state>
    <amp-state></amp-state>
    <amp-img></amp-img>
    `;
    expect(() => {
      ElementLimits.process(code, config);
    }).toThrow();
  });
});
