import { module as ViewerRenderProxy } from '../../../framecontainer/rendering-modules/ViewerRenderProxy';
import {
  ProxyRequest,
  ProxyResponse,
} from '../../../framecontainer/rendering-modules/ProxyRequest';
import * as util from '../../../util';

describe('ViewerRenderProxy module', () => {
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
    expect(ViewerRenderProxy.name).toBe('ViewerRenderProxy');
  });

  test('proxies template requests', async () => {
    const handler = setupViewerRenderProxy({
      templateProxyURL: 'https://proxy.example/',
    });

    const req = {
      originalRequest: { input: 'https://endpoint.example/', init: {} },
    };
    const res = {
      body: '{}',
      init: {},
    };
    postJSONMock.mockReturnValueOnce(Promise.resolve(res));
    const result = await handler('viewerRenderTemplate', req, true);
    expect(result).toBe(res);

    const call = postJSONMock.mock.calls[postJSONMock.mock.calls.length - 1];
    expect(call[0]).toBe('https://proxy.example/');
    expect(call[1]).toBe(req);
  });

  test('throws on invalid proxy URL', () => {
    expect(() => {
      setupViewerRenderProxy({ templateProxyURL: 'foo' });
    }).toThrow();
  });

  test('no handler registered if proxy URL is not specified', () => {
    const handler = setupViewerRenderProxy({});
    expect(handler).toBeNull();
  });
});

function setupViewerRenderProxy(config = {}) {
  const messaging = {
    registerHandler: jest.fn(),
  };
  const frameContainer = {
    getConfig: () => config,
    getMessaging: () => messaging,
  };

  // tslint:disable:no-any
  ViewerRenderProxy.load(frameContainer as any);
  if (!messaging.registerHandler.mock.calls[0]) {
    return null;
  }
  expect(messaging.registerHandler.mock.calls[0][0]).toBe(
    'viewerRenderTemplate'
  );
  return messaging.registerHandler.mock.calls[0][1];
}
