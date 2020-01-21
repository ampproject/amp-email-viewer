import { module as XHRProxy } from '../../../framecontainer/rendering-modules/XHRProxy';
import {
  ProxyRequest,
  ProxyResponse,
} from '../../../framecontainer/rendering-modules/ProxyRequest';
import * as util from '../../../util';

describe('XHRProxy module', () => {
  let postJSONOriginal: typeof util.postJSON;
  let postJSONMock: jest.Mock<Promise<ProxyResponse>, [string, ProxyRequest]>;

  beforeAll(() => {
    postJSONMock = jest.fn();
    postJSONOriginal = util.postJSON;
    // tslint:disable:no-any
    (util as any).postJSON = postJSONMock;
  });

  afterAll(() => {
    // tslint:disable:no-any
    (util as any).postJSON = postJSONOriginal;
  });

  test('has correct name', () => {
    expect(XHRProxy.name).toBe('XHRProxy');
  });

  test('proxies XHR requests', async () => {
    const handler = setupXHRProxy({ xhrProxyURL: 'https://proxy.example/' });

    const req = {
      originalRequest: { input: 'https://endpoint.example/', init: {} },
      senderEmail: 'sender@example.com',
    };
    const res = {
      body: '{}',
      init: {},
    };
    postJSONMock.mockReturnValueOnce(Promise.resolve(res));
    const result = await handler('xhr', req, true);
    expect(result).toBe(res);

    const call = postJSONMock.mock.calls[postJSONMock.mock.calls.length - 1];
    expect(call[0]).toBe('https://proxy.example/');
    expect(call[1]).toEqual(req);
  });

  test('no handler registered if proxy URL is not specified', () => {
    const handler = setupXHRProxy({});
    expect(handler).toBeNull();
  });
});

function setupXHRProxy(config = {}) {
  const messaging = {
    registerHandler: jest.fn(),
  };
  const frameContainer = {
    getConfig: () => config,
    getMessaging: () => messaging,
    getSenderEmail: () => 'sender@example.com',
  };

  // tslint:disable:no-any
  XHRProxy.load(frameContainer as any);
  if (!messaging.registerHandler.mock.calls[0]) {
    return null;
  }
  expect(messaging.registerHandler.mock.calls[0][0]).toBe('xhr');
  return messaging.registerHandler.mock.calls[0][1];
}
