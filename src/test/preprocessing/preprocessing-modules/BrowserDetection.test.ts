import { module as BrowserDetection } from '../../../preprocessing/preprocessing-modules/BrowserDetection';

const SUPPORTED_USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 OPR/65.0.3467.72',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:61.0) Gecko/20100101 Firefox/71.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 8.0.0;) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/79.0.3945.73 Mobile/15E148 Safari/605.1',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.1 Safari/603.1.30',
];

const UNSUPPORTED_USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 Edg/44.18362.449.0',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko',
  'Mozilla/5.0 (Series40; Nokia200/11.64; Profile/MIDP-2.1 Configuration/CLDC-1.1) Gecko/20100401 S40OviBrowser/2.0.2.68.14',
  'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36',
  'Mozilla/5.0 (Windows NT 5.1; rv:33.0) Gecko/20100101 Firefox/33.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_1 like Mac OS X; en-us) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/10.2.1 Mobile/13E238 Safari/601.1',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0.1 Safari/602.2.14',
];

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
    const code = 'Hello world';
    for (const ua of SUPPORTED_USER_AGENTS) {
      userAgent.mockReturnValue(ua);
      const out = BrowserDetection.processText(code, config);
      expect(out).toBe(code);
    }
  });

  test('throws in unsupported browser', () => {
    const code = 'Hello world';
    for (const ua of UNSUPPORTED_USER_AGENTS) {
      userAgent.mockReturnValue(ua);
      expect(() => {
        BrowserDetection.processText(code, config);
      }).toThrow('Unsupported browser');
    }
  });
});
