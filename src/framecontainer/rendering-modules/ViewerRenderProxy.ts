import { FrameContainer } from '../FrameContainer';
import { Messaging } from '@ampproject/viewer-messaging';
import { TemplateProxyRequest, TemplateProxyResponse } from './ProxyRequest';

/**
 * Reacts to changes to the AMP document's height and resizes the iframe to
 * adjust to them.
 */
class ViewerRenderProxyImpl {
  private messaging: Messaging;

  constructor(frameContainer: FrameContainer) {
    this.messaging = frameContainer.getMessaging();
  }

  start(): void {
    this.messaging.registerHandler('viewerRenderTemplate', this.viewerRenderTemplateHandler);
  }

  private viewerRenderTemplateHandler = (
    name: string,
    data: TemplateProxyRequest,
    rsvp: boolean
  ): Promise<TemplateProxyResponse> => {
    console.log(data);
    return Promise.resolve({
      html: 'test',
      init: {
        status: 200
      }
    });
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
