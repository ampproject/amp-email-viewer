import { module as SizeCheck } from '../../../preprocessing/preprocessing-modules/SizeCheck';

describe('SizeCheck module', () => {
  beforeAll(() => {
    // JSDOM doesn't support this yet
    // tslint:disable:no-any
    window.TextEncoder = class {
      encode(text: string): string {
        return text;
      }
    } as any;
  });

  afterAll(() => {
    delete window.TextEncoder;
  });

  test('has correct name', () => {
    expect(SizeCheck.name).toBe('SizeCheck');
  });

  test('works with no size limit', () => {
    const code = 'Hello world';
    // tslint:disable:no-any
    const err = SizeCheck.validateText(code, {} as any);
    expect(err).toBeNull();
  });

  test('works when within limit', () => {
    const code = 'Hello world';
    // tslint:disable:no-any
    const err = SizeCheck.validateText(code, { maximumAMPSize: 100 } as any);
    expect(err).toBeNull();
  });

  test('throws if limit exceeded', () => {
    const code = 'Hello world';
    // tslint:disable:no-any
    const err = SizeCheck.validateText(code, { maximumAMPSize: 10 } as any);
    expect(err).not.toBeNull();
  });
});
