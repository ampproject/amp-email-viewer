import { FrameContainer } from '../FrameContainer';
import { ProxyRequest, ProxyResponse } from './ProxyRequest';
import { postJSON } from '../../util';

/**
 * Reacts to changes to the AMP document's height and resizes the iframe to
 * adjust to them.
 */
class XHRProxyImpl {
  private readonly proxyURL: string;
  private readonly frameContainer: FrameContainer;

  constructor(frameContainer: FrameContainer) {
    this.frameContainer = frameContainer;
    this.proxyURL = frameContainer.getConfig().xhrProxyURL || '';
  }

  start(): void {
    if (!this.proxyURL) {
      return;
    }
    const messaging = this.frameContainer.getMessaging();
    messaging.registerHandler('xhr', this.xhrHandler);
  }

  private xhrHandler = (
    name: string,
    data: ProxyRequest,
    rsvp: boolean
  ): Promise<ProxyResponse> => {
    const senderEmail = this.frameContainer.getSenderEmail();
    const request = Object.assign({}, data, { senderEmail });
    return postJSON(this.proxyURL, request);
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
