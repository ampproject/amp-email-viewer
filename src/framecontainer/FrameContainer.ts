import { createIframe } from './createIframe';
import { appendParametersToURL } from './viewerParameters';
import * as viewerConfig from './viewerConfig';
import { Messaging } from '@ampproject/viewer-messaging';
import { modules as renderingModules } from './rendering-modules/index';
import { Config } from '../config';

/**
 * Creates an iframe element with the provided options that includes sandbox
 * attributes, feature policy and styles.
 *
 * @param {HTMLElement} parent Element to create an iframe inside of
 * @param {IframeOptions} options Options used for the iframe
 * @return {HTMLIFrameElement} Newly created iframe element
 */
export class FrameContainer {
  private readonly parent: HTMLElement;
  private readonly config: Config;
  private readonly targetOrigin: string;
  private readonly messagingToken: string;
  private readonly renderingModules: Set<string>;

  private iframe: HTMLIFrameElement | null = null;
  private messaging: Messaging | null = null;

  /**
   * @param {HTMLElement} parent Element to create an iframe inside of
   * @param {Config} config Config with parameters related to the AMP viewer
   */
  constructor(parent: HTMLElement, config: Config) {
    this.parent = parent;
    this.config = config;
    this.targetOrigin = this.getTargetOrigin();
    this.messagingToken = this.generateMessagingToken();
    this.renderingModules = new Set(viewerConfig.DEFAULT_RENDERING_MODULES);
  }

  /**
   * Renders the provided AMP code inside the frame container.
   *
   * @param {string} amp AMP code to display
   * @return {Promise} Resolves when rendered
   */
  async render(amp: string): Promise<void> {
    if (this.iframe) {
      this.parent.removeChild(this.iframe);
      this.iframe = null;
      this.messaging = null;
    }

    this.createViewerIframe();
    await this.injectAMP(amp);
    await this.startMessaging();
  }

  /**
   * Returns the iframe element that contains an AMP page.
   *
   * @return {HTMLIFrameElement}
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
   * @return {Messaging}
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
   * @return {Config}
   */
  getConfig(): Config {
    return this.config;
  }

  /**
   * Enables the given rendering module. Must be called before render.
   *
   * @param {string} module Name of module to enable
   */
  enableRenderingModule(module: string) {
    this.renderingModules.add(module);
  }

  /**
   * Disables the given rendering module. Must be called before render.
   *
   * @param {string} module Name of module to disable
   */
  disableRenderingModule(module: string) {
    this.renderingModules.delete(module);
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
