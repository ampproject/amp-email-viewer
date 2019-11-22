/**
 * Global config that defines the behavior of both the viewer and preprocessing.
 */
export interface Config {
  /**
   * URL of the relay page that's the src of the iframe and that receives the
   * AMP code.
   */
  relayPage: string;

  /**
   * Whether to render the AMP page in an opaque origin iframe.
   */
  useOpaqueOrigin: boolean;

  /**
   * URL of the image proxy. If unset, images are not proxied.
   */
  imageProxyURL?: string;

  /**
   * URL of the link redirection endpoint. If unset, hyperlinks are not replaced
   * with redirects.
   */
  linkRedirectURL?: string;

  /**
   * If set, the viewer will stop loading AMP if an error occurs within the
   * given number of milliseconds.
   */
  failOnLoadErrorAfter?: number;

  /**
   * If set, the viewer will stop loading AMP if the page hasn't loaded after
   * the given number of milliseconds.
   */
  loadTimeout?: number;

  /**
   * If set, pins the RTV of the AMP runtime to the given version.
   *
   * Must not be set if runtimeCDN is set.
   */
  rtvPin?: string;

  /**
   * If set, replaces URLs to the AMP CDN (cdn.ampproject.org) with the given
   * URL.
   *
   * Must not be set if rtvPin is set.
   */
  runtimeCDN?: string;
}

// tslint:disable:no-any
export function validateConfig(config: any): config is Config {
  if (typeof config !== 'object') {
    return false;
  }
  if (!isURL(config.relayPage)) {
    return false;
  }
  if (typeof config.useOpaqueOrigin !== 'boolean') {
    return false;
  }
  if (config.imageProxyURL && !isURL(config.imageProxyURL)) {
    return false;
  }
  if (config.linkRedirectURL && !isURL(config.linkRedirectURL)) {
    return false;
  }

  if (
    config.rtvPin &&
    (typeof config.rtvPin !== 'string' || !config.rtvPin.match(/^\d{15}$/))
  ) {
    return false;
  }
  if (config.runtimeCDN && !isURL(config.runtimeCDN)) {
    return false;
  }
  if (
    config.failOnLoadErrorAfter &&
    (typeof config.failOnLoadErrorAfter !== 'number' ||
      config.failOnLoadErrorAfter < 0 ||
      config.failOnLoadErrorAfter > 10000)
  ) {
    return false;
  }
  if (
    config.loadTimeout &&
    (typeof config.loadTimeout !== 'number' ||
      config.loadTimeout < 0 ||
      config.loadTimeout > 10000)
  ) {
    return false;
  }
  if (config.rtvPin && config.runtimeCDN) {
    return false;
  }
  return true;
}

function isURL(url: string): boolean {
  try {
    // tslint:disable:no-unused-expression
    new URL(url);
  } catch (_) {
    return false;
  }
  return true;
}
