import { FrameContainer } from '../FrameContainer';
import { Messaging } from '@ampproject/viewer-messaging';
import { TemplateProxyRequest, TemplateProxyResponse } from './ProxyRequest';
import { Config } from '../../config';
import { isValidURL, postJSON } from '../../util';

/**
 * Reacts to changes to the AMP document's height and resizes the iframe to
 * adjust to them.
 */
class ViewerRenderProxyImpl {
  private readonly proxyURL: string;
  private readonly messaging: Messaging;

  constructor(frameContainer: FrameContainer) {
    const config = frameContainer.getConfig();
    this.proxyURL = config.templateProxyURL || '';
    this.messaging = frameContainer.getMessaging();
  }

  start(): void {
    if (!this.proxyURL) {
      return;
    }
    if (!isValidURL(this.proxyURL)) {
      throw new Error('Invalid proxy URL found in config');
    }
    this.messaging.registerHandler(
      'viewerRenderTemplate',
      this.viewerRenderTemplateHandler
    );
  }

  private viewerRenderTemplateHandler = (
    name: string,
    data: TemplateProxyRequest,
    rsvp: boolean
  ): Promise<TemplateProxyResponse> => {
    return postJSON(this.proxyURL, data);
  };

  documentLoaded(): void {}
  documentUnloaded(): void {}
}

function load(frameContainer: FrameContainer) {
  const impl = new ViewerRenderProxyImpl(frameContainer);
  impl.start();
  return impl;
}

export const module = {
  name: 'ViewerRenderProxy',
  load,
};
