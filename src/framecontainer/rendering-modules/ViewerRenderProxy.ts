import { FrameContainer } from '../FrameContainer';
import { TemplateProxyRequest, TemplateProxyResponse } from './ProxyRequest';
import { parseHTMLFragment, serializeHTML, postJSON } from '../../util';
import { transformingModules } from '../../preprocessing/preprocessing-modules/index';
import { Config } from '../../config';

const TEMPLATE_TRANSFORMING_MODULES = ['HyperlinkRewrite', 'ImageURLRewrite'];

/**
 * Reacts to changes to the AMP document's height and resizes the iframe to
 * adjust to them.
 */
class ViewerRenderProxyImpl {
  private readonly proxyURL: string;
  private readonly config: Config;
  private readonly frameContainer: FrameContainer;

  constructor(frameContainer: FrameContainer) {
    this.frameContainer = frameContainer;
    this.config = frameContainer.getConfig();
    this.proxyURL = this.config.templateProxyURL || '';
  }

  start(): void {
    if (!this.proxyURL) {
      return;
    }
    const messaging = this.frameContainer.getMessaging();
    messaging.registerHandler(
      'viewerRenderTemplate',
      this.viewerRenderTemplateHandler
    );
  }

  private viewerRenderTemplateHandler = async (
    name: string,
    data: TemplateProxyRequest,
    rsvp: boolean
  ): Promise<TemplateProxyResponse> => {
    const senderEmail = this.frameContainer.getSenderEmail();
    const request = Object.assign({}, data, { senderEmail });
    const resp: TemplateProxyResponse = await postJSON(this.proxyURL, request);
    if (this.config.transformTemplateProxyOutput) {
      resp.html = await this.processHTML(resp.html);
    }
    return resp;
  };

  private async processHTML(input: string): Promise<string> {
    if (!input) {
      return input;
    }

    const doc = parseHTMLFragment(input);
    const moduleSet = new Set(TEMPLATE_TRANSFORMING_MODULES);
    for (const module of transformingModules) {
      if (!moduleSet.has(module.name)) {
        continue;
      }
      await module.transform(doc, this.config);
    }
    return serializeHTML(doc);
  }

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
