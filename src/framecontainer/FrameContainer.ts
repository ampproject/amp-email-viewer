import { createIframe } from './createIframe';
import { appendParametersToURL } from './viewerParameters';
import * as config from './config';
import { Messaging } from '@ampproject/viewer-messaging';
import { modules as renderingModules } from './rendering-modules/index';

export class FrameContainer {
  private parent: HTMLElement;
  private relayPage: string;
  private targetOrigin: string;
  private messagingToken: string;
  private renderingModules: Set<string>;

  private iframe: HTMLIFrameElement | null = null;
  private messaging: Messaging | null = null;

  constructor(parent: HTMLElement, relayPage: string, targetOrigin = 'null') {
    this.parent = parent;
    this.relayPage = relayPage;
    this.targetOrigin = targetOrigin;
    this.messagingToken = this.generateMessagingToken();
    this.renderingModules = new Set(config.DEFAULT_RENDERING_MODULES);
  }

  async render(amp: string): Promise<void> {
    if (this.iframe) {
      this.parent.removeChild(this.iframe);
    }

    this.createViewerIframe();
    await this.injectAMP(amp);
    await this.startMessaging();
  }

  getIframe(): HTMLIFrameElement {
    if (!this.iframe) {
      throw new Error('iframe not initialized yet');
    }
    return this.iframe;
  }

  getMessaging(): Messaging {
    if (!this.messaging) {
      throw new Error('Messaging not initialized yet');
    }
    return this.messaging;
  }

  enableRenderingModule(module: string) {
    this.renderingModules.add(module);
  }

  disableRenderingModule(module: string) {
    this.renderingModules.delete(module);
  }

  private createViewerIframe(): void {
    this.iframe = createIframe(this.parent, {
      src: this.getIframeSrc(),
      width: '100%',
      height: '1',
      featurePolicy: config.IFRAME_FEATURE_POLICY,
      sandbox: this.getIframeSandbox(),
      styles: config.IFRAME_STYLES,
    });
  }

  private async waitForIframeLoad(): Promise<void> {
    return new Promise(resolve => {
      this.iframe!.addEventListener('load', () => resolve());
    });
  }

  private async injectAMP(amp: string) {
    await this.waitForIframeLoad();
    this.iframe!.contentWindow!.postMessage({ amp }, '*');
  }

  private async startMessaging(): Promise<void> {
    const target = this.iframe!.contentWindow!;
    const messaging = await Messaging.waitForHandshakeFromDocument(
      window,
      target,
      this.targetOrigin,
      this.messagingToken
    );
    this.messaging = messaging;
    this.messaging.setDefaultHandler(this.messageHandler);
    this.loadRenderingModules();
    this.messaging.sendRequest('visibilitychange', {}, true);
  }

  private loadRenderingModules() {
    for (const module of renderingModules) {
      if (this.renderingModules.has(module.name)) {
        module.load(this);
      }
    }
  }

  private messageHandler = (name: string, data: {}, rsvp: boolean) => {
    console.log(`Received message: ${name}`);
    return Promise.resolve();
  };

  private getIframeSandbox(): string[] {
    if (this.targetOrigin === 'null') {
      return config.IFRAME_SANDBOX;
    }
    return config.IFRAME_SANDBOX.concat('allow-same-origin');
  }

  private getIframeSrc(): string {
    const params = Object.assign(
      {
        origin: window.location.origin,
        messagingToken: this.messagingToken,
      },
      config.VIEWER_PARAMETERS
    );
    return appendParametersToURL(this.relayPage, params);
  }

  private generateMessagingToken(): string {
    const bytes = new Uint8Array(32);
    window.crypto.getRandomValues(bytes);
    const bytesStr = String.fromCharCode.apply(null, Array.from(bytes));
    return btoa(bytesStr);
  }
}
