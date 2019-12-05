import { module as BrowserDetection } from '../../../preprocessing/preprocessing-modules/BrowserDetection';

describe('BrowserDetection module', () => {
  // tslint:disable:no-any
  const config = {} as any;

  let userAgent: jest.SpyInstance<string, []>;

  beforeAll(() => {
    userAgent = jest.spyOn(navigator, 'userAgent', 'get');
  });

  afterAll(() => {
    userAgent.mockClear();
  });

  test('has correct name', () => {
    expect(BrowserDetection.name).toBe('BrowserDetection');
  });

  test('works in supported browser', () => {
    userAgent.mockReturnValue(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
    );
    const code = 'Hello world';
    const out = BrowserDetection.process(code, config);
    expect(out).toBe(code);
  });

  test('throws in unsupported browser', () => {
    userAgent.mockReturnValue(
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
    );
    const code = 'Hello world';
    expect(() => {
      BrowserDetection.process(code, config);
    }).toThrow();
  });
});
