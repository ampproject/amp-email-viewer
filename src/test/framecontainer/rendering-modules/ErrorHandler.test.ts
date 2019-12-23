import { module as ErrorHandler } from '../../../framecontainer/rendering-modules/ErrorHandler';

describe('ErrorHandler module', () => {
  test('has correct name', () => {
    expect(ErrorHandler.name).toBe('ErrorHandler');
  });

  test('unexpected error reports to frame container', async () => {
    jest.useFakeTimers();
    const { handler, frameContainer } = setupErrorHandler({
      failOnLoadErrorAfter: 5000,
    });
    setTimeout(() => {
      handler(
        'error',
        {
          a: '0',
          ex: '0',
          m: 'error text',
        },
        false
      );
    }, 1000);
    jest.runAllTimers();

    // creates new microtask to ensure promises inside module resolve
    await Promise.resolve();
    expect(frameContainer.reportError.mock.calls[0]).toEqual(['error text']);
  });

  test('unexpected error ignored if no timeout specified', async () => {
    jest.useFakeTimers();
    const { handler, frameContainer } = setupErrorHandler({});
    setTimeout(() => {
      handler(
        'error',
        {
          a: '0',
          ex: '0',
          m: 'error text',
        },
        false
      );
    }, 1000);
    jest.runAllTimers();

    // creates new microtask to ensure promises inside module resolve
    await Promise.resolve();
    expect(frameContainer.reportError.mock.calls).toEqual([]);
  });
});

function setupErrorHandler(config: {}) {
  const messaging = {
    registerHandler: jest.fn(),
  };
  const frameContainer = {
    getConfig: () => config,
    getMessaging: () => messaging,
    reportError: jest.fn(),
  };

  // tslint:disable:no-any
  const module = ErrorHandler.load(frameContainer as any);
  expect(messaging.registerHandler.mock.calls[0][0]).toBe('error');
  const handler = messaging.registerHandler.mock.calls[0][1];
  module.documentLoaded();
  return { handler, frameContainer };
}
