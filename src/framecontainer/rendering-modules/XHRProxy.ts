import { FrameContainer } from '../FrameContainer';
import { ProxyRequest, ProxyResponse } from './ProxyRequest';
import { postJSON } from '../../util';
import { Config } from '../../config';

/**
 * Proxies XHR requests coming from AMP's runtime.
 */
class XHRProxyImpl {
  private readonly proxyURL: string;
  private readonly config: Config;
  private readonly frameContainer: FrameContainer;

  constructor(frameContainer: FrameContainer) {
    this.frameContainer = frameContainer;
    this.config = frameContainer.getConfig();
    this.proxyURL = this.config.xhrProxyURL || '';
  }

  start(): void {
    if (!this.proxyURL) {
      return;
    }
    const messaging = this.frameContainer.getMessaging();
    messaging.registerHandler('xhr', this.xhrHandler);
  }

  private xhrHandler = async (
    name: string,
    data: ProxyRequest,
    rsvp: boolean
  ): Promise<ProxyResponse> => {
    if (this.shouldSkipProxy(data)) {
      return this.fetchWithoutProxy(data);
    }
    return this.fetchWithProxy(data);
  };

  private shouldSkipProxy(data: ProxyRequest) {
    return (
      this.config.runtimeCDN &&
      data.originalRequest.input.startsWith(this.config.runtimeCDN) &&
      data.originalRequest.init.ampCors === false
    );
  }

  private async fetchWithProxy(data: ProxyRequest): Promise<ProxyResponse> {
    const senderEmail = this.frameContainer.getSenderEmail();
    const request = Object.assign({}, data, { senderEmail });
    return postJSON(this.proxyURL, request);
  }

  private async fetchWithoutProxy(data: ProxyRequest): Promise<ProxyResponse> {
    const { init, input } = data.originalRequest;
    const fetched = await fetch(input, {
      method: 'GET',
      headers: new Headers(init.headers),
      redirect: 'error',
      credentials: 'omit',
    });
    return {
      body: await fetched.text(),
      init: {
        status: fetched.status,
      },
    };
  }

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
