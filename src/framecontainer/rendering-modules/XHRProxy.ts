import { FrameContainer } from '../FrameContainer';
import { Messaging } from '@ampproject/viewer-messaging';
import { ProxyRequest, ProxyResponse } from './ProxyRequest';
import { Config } from '../../config';
import { isValidURL, postJSON } from '../../util';

/**
 * Reacts to changes to the AMP document's height and resizes the iframe to
 * adjust to them.
 */
class XHRProxyImpl {
  private readonly proxyURL: string;
  private readonly messaging: Messaging;

  constructor(frameContainer: FrameContainer) {
    const config = frameContainer.getConfig();
    this.proxyURL = config.xhrProxyURL || config.templateProxyURL || '';
    this.messaging = frameContainer.getMessaging();
  }

  start(): void {
    if (!this.proxyURL) {
      return;
    }
    if (!isValidURL(this.proxyURL)) {
      throw new Error('Invalid proxy URL found in config');
    }
    this.messaging.registerHandler('xhr', this.xhrHandler);
  }

  private xhrHandler = (
    name: string,
    data: ProxyRequest,
    rsvp: boolean
  ): Promise<ProxyResponse> => {
    return postJSON(this.proxyURL, data);
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
