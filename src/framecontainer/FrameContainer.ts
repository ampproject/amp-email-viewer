import { createIframe } from './createIframe';
import { appendParametersToURL, ViewerCapability } from './viewerParameters';
import * as viewerConfig from './viewerConfig';
import { Messaging } from '@ampproject/viewer-messaging';
import {
  modules as renderingModules,
  ModuleInstance,
} from './rendering-modules/index';
import { Config } from '../config';

/**
 * Creates an iframe that can render an AMP document, connects it with viewer
 * messaging and loads the rendering modules.
 */
export class FrameContainer {
  private readonly parent: HTMLElement;
  private readonly config: Config;
  private readonly targetOrigin: string;
  private readonly messagingToken: string;
  private readonly enabledRenderingModules: Set<string>;

  private iframe: HTMLIFrameElement | null = null;
  private messaging: Messaging | null = null;
  private renderingModules: ModuleInstance[] = [];
  private documentLoadResolver: (() => void) | null = null;
  private senderEmail: string;

  /**
   * @param {!HTMLElement} parent Element to create an iframe inside of
   * @param {!Config} config Config with parameters related to the AMP viewer
   */
  constructor(parent: HTMLElement, config: Config, senderEmail: string) {
    this.parent = parent;
    this.config = config;
    this.senderEmail = senderEmail;
    this.targetOrigin = this.getTargetOrigin();
    this.messagingToken = this.generateMessagingToken();
    this.enabledRenderingModules = new Set(
      viewerConfig.DEFAULT_RENDERING_MODULES
    );
  }

  /**
   * Renders the provided AMP code inside the frame container.
   *
   * @param {string} amp AMP code to display
   * @return {!Promise} Resolves when rendered
   */
  async render(amp: string): Promise<void> {
    if (this.iframe) {
      this.parent.removeChild(this.iframe);
      this.iframe = null;
      this.unloadDocument();
    }

    this.createViewerIframe();
    await this.injectAMP(amp);
    this.startLoadingTimer();
    await this.startMessaging();
  }

  /**
   * Unloads the AMP document and displays an error in its place.
   *
   * @param {string=} error Information about the error
   */
  reportError(error?: string) {
    if (!this.iframe) {
      return;
    }

    this.unloadDocument();
    let message = 'Error loading AMP page.';
    if (error) {
      message += '\n' + error;
    }
    this.iframe.src = 'data:text/plain;base64,' + btoa(message);
    this.iframe.setAttribute('height', '50');
  }

  /**
   * Returns the iframe element that contains an AMP page.
   *
   * @return {!HTMLIFrameElement}
   */
  getIframe(): HTMLIFrameElement {
    if (!this.iframe) {
      throw new Error('iframe not initialized yet');
    }
    return this.iframe;
  }

  /**
   * Returns the Messaging object used to communicate with the AMP page.
   *
   * @return {!Messaging}
   */
  getMessaging(): Messaging {
    if (!this.messaging) {
      throw new Error('Messaging not initialized yet');
    }
    return this.messaging;
  }

  /**
   * Returns the Config.
   *
   * @return {!Config}
   */
  getConfig(): Config {
    return this.config;
  }

  /**
   * Returns the sender email.
   *
   * @return {string}
   */
  getSenderEmail(): string {
    return this.senderEmail.toLowerCase();
  }

  /**
   * Sets the sender email.
   *
   * @param {string} senderEmail New sender email to use
   */
  setSenderEmail(senderEmail: string) {
    this.senderEmail = senderEmail;
  }

  /**
   * Enables the given rendering module. Must be called before render.
   *
   * @param {string} module Name of module to enable
   */
  enableRenderingModule(module: string) {
    this.enabledRenderingModules.add(module);
  }

  /**
   * Disables the given rendering module. Must be called before render.
   *
   * @param {string} module Name of module to disable
   */
  disableRenderingModule(module: string) {
    this.enabledRenderingModules.delete(module);
  }

  private unloadDocument() {
    this.messaging = null;
    for (const module of this.renderingModules) {
      module.documentUnloaded();
    }
    this.renderingModules = [];
  }

  private createViewerIframe(): void {
    this.iframe = createIframe(this.parent, {
      src: this.getIframeSrc(),
      width: '100%',
      height: '1',
      featurePolicy: viewerConfig.IFRAME_FEATURE_POLICY,
      sandbox: this.getIframeSandbox(),
      styles: viewerConfig.IFRAME_STYLES,
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

  private async startLoadingTimer() {
    try {
      await new Promise((resolve, reject) => {
        this.documentLoadResolver = resolve;
        if (this.config.loadTimeout) {
          setTimeout(() => reject(), this.config.loadTimeout);
        }
      });
    } catch (e) {
      this.reportError('Loading timeout');
    }
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
    this.messaging.registerHandler('documentLoaded', this.documentLoaded);
    this.loadRenderingModules();
    this.messaging.sendRequest('visibilitychange', {}, true);
  }

  private loadRenderingModules() {
    for (const module of renderingModules) {
      if (this.enabledRenderingModules.has(module.name)) {
        this.renderingModules.push(module.load(this));
      }
    }
  }

  private messageHandler = (name: string, data: {}, rsvp: boolean) => {
    console.log(`Received message: ${name} ${JSON.stringify(data)}`);
    return Promise.resolve();
  };

  private documentLoaded = (name: string, data: {}, rsvp: boolean) => {
    if (this.documentLoadResolver) {
      this.documentLoadResolver();
      this.documentLoadResolver = null;
    }
    for (const module of this.renderingModules) {
      module.documentLoaded();
    }
    return Promise.resolve();
  };

  private getIframeSandbox(): string[] {
    if (this.config.useOpaqueOrigin) {
      return viewerConfig.IFRAME_SANDBOX;
    }
    return viewerConfig.IFRAME_SANDBOX.concat('allow-same-origin');
  }

  private getIframeSrc(): string {
    const params = Object.assign(
      {
        origin: window.location.origin,
        messagingToken: this.messagingToken,
      },
      viewerConfig.VIEWER_PARAMETERS
    );
    if (this.config.xhrProxyURL) {
      params.cap = params.cap || [];
      params.cap.push(ViewerCapability.XHR_INTERCEPTOR);
    }
    return appendParametersToURL(this.config.relayPageURL, params);
  }

  private generateMessagingToken(): string {
    const bytes = new Uint8Array(32);
    window.crypto.getRandomValues(bytes);
    const bytesStr = String.fromCharCode.apply(null, Array.from(bytes));
    return btoa(bytesStr);
  }

  private getTargetOrigin() {
    if (this.config.useOpaqueOrigin) {
      return 'null';
    }
    return new URL(this.config.relayPageURL).origin;
  }
}
