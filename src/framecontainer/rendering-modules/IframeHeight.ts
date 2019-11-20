import { FrameContainer } from '../FrameContainer';
import { Messaging } from '@ampproject/viewer-messaging';

/**
 * Reacts to changes to the AMP document's height and resizes the iframe to
 * adjust to them.
 */
class IframeHeightImpl {
  private iframe: HTMLIFrameElement;
  private messaging: Messaging;

  constructor(frameContainer: FrameContainer) {
    this.iframe = frameContainer.getIframe();
    this.messaging = frameContainer.getMessaging();
  }

  start(): void {
    this.messaging.registerHandler(
      'documentHeight',
      this.documentHeightHandler
    );
  }

  private documentHeightHandler = (
    name: string,
    data: { height: number },
    rsvp: boolean
  ): Promise<void> => {
    this.iframe.setAttribute('height', String(data.height));
    return Promise.resolve();
  };
}

function load(frameContainer: FrameContainer) {
  const impl = new IframeHeightImpl(frameContainer);
  impl.start();
}

export const module = {
  name: 'IframeHeight',
  load,
};
