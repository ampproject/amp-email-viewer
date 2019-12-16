import { FrameContainer } from '../FrameContainer';
import { Messaging } from '@ampproject/viewer-messaging';
import { ProxyRequest, ProxyResponse } from './ProxyRequest';

/**
 * Reacts to changes to the AMP document's height and resizes the iframe to
 * adjust to them.
 */
class XHRProxyImpl {
  private messaging: Messaging;

  constructor(frameContainer: FrameContainer) {
    this.messaging = frameContainer.getMessaging();
  }

  start(): void {
    this.messaging.registerHandler('xhr', this.xhrHandler);
  }

  private xhrHandler = (
    name: string,
    data: ProxyRequest,
    rsvp: boolean
  ): Promise<ProxyResponse> => {
    console.log(data);
    return Promise.resolve({
      body: '{"items": [{"test": "a"}]}',
      init: {
        status: 200,
        headers: [
          ['Content-Type', 'application/json']
        ]
      }
    });
  };

  documentLoaded(): void {}
  documentUnloaded(): void {}
}

function load(frameContainer: FrameContainer) {
  const impl = new XHRProxyImpl(frameContainer);
  impl.start();
  return impl;
}

export const module = {
  name: 'XHRProxy',
  load,
};
