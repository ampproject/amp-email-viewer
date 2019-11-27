import { module as IframeHeight } from '../../../framecontainer/rendering-modules/IframeHeight';

test('IframeHeight resizes iframe', async () => {
  expect(IframeHeight.name).toBe('IframeHeight');

  const iframe = {
    setAttribute: jest.fn(),
  };
  const messaging = {
    registerHandler: jest.fn(),
  };
  const frameContainer = {
    getIframe: () => iframe,
    getMessaging: () => messaging,
  };

  // tslint:disable:no-any
  IframeHeight.load(frameContainer as any);
  expect(messaging.registerHandler.mock.calls[0][0]).toBe('documentHeight');
  const handler = messaging.registerHandler.mock.calls[0][1];
  handler('documentHeight', { height: 20 }, false);
  expect(iframe.setAttribute.mock.calls[0]).toEqual(['height', '20']);
});
