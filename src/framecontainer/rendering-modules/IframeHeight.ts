import {FrameContainer} from '../FrameContainer';
import {Messaging} from '@ampproject/viewer-messaging';

class IframeHeightImpl {
  private iframe: HTMLIFrameElement;
  private messaging: Messaging;

  constructor(frameContainer: FrameContainer) {
    this.iframe = frameContainer.getIframe();
    this.messaging = frameContainer.getMessaging();
  }

  public start(): void {
    this.messaging.registerHandler('documentHeight', this.documentHeightHandler);
  }

  private documentHeightHandler = (
    name: string,
    data: any,
    rsvp: boolean
  ): Promise<void> => {
    this.iframe.setAttribute('height', data.height);
    return Promise.resolve();
  };
}

function load(frameContainer: FrameContainer) {
  const impl = new IframeHeightImpl(frameContainer);
  impl.start();
}

export default {
  name: 'IframeHeight',
  load
};
