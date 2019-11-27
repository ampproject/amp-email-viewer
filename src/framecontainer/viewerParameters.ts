/**
 * Parameters allowed by the AMP Viewer API.
 *
 * @see {@link https://github.com/ampproject/amphtml/blob/master/extensions/amp-viewer-integration/amp-doc-viewer-api.md}
 */
export interface ViewerParameters {
  cap?: ViewerCapability[];
  origin?: string;
  cid?: boolean;
  csi?: boolean;
  dialog?: boolean;
  development?: boolean;
  history?: boolean;
  horizontalScrolling?: boolean;
  log?: boolean;
  paddingTop?: number;
  prerenderSize?: number;
  p2r?: boolean;
  referrer?: string;
  storage?: boolean;
  viewerUrl?: string;
  webview?: boolean;
  highlight?: string;
  messagingToken?: string;
  viewportType?: ViewerViewportType;
  visibilityState?: ViewerVisibilityState;
}

/**
 * AMP Viewer capabilities that can be specified in the `cap` parameter.
 *
 * @see {@link https://github.com/ampproject/amphtml/blob/master/extensions/amp-viewer-integration/CAPABILITIES.md}
 */
export enum ViewerCapability {
  A2A = 'a2a',
  CLIENT_ID_SERVICE = 'cid',
  ERROR_REPORTER = 'errorReporter',
  FRAGMENT = 'fragment',
  HANDSHAKEPOLL = 'handshakepoll',
  NAVIGATE_TO = 'navigateTo',
  REPLACE_URL = 'replaceUrl',
  SWIPE = 'swipe',
  VIEWER_RENDER_TEMPLATE = 'viewerRenderTemplate',
  XHR_INTERCEPTOR = 'xhrInterceptor',
}

/**
 * AMP Viewer viewport types that can be specified in the `viewportType`
 * parameter.
 */
export enum ViewerViewportType {
  NATURAL = 'natural',
  NATURAL_IOS_EMBED = 'natural-ios-embed',
}

/**
 * AMP Viewer visibility states that can be specified in the `visibilityState`
 * parameter.
 */
export enum ViewerVisibilityState {
  INACTIVE = 'inactive',
  PAUSED = 'paused',
  VISIBLE = 'visible',
  PRERENDER = 'prerender',
  HIDDEN = 'hidden',
}

/**
 * AMP Viewer parameters are provided as a query string that follows a fragment
 * identifier (#). For example, https://amp.example/page.html#foo=1&bar=2
 *
 * This function appends the given parameters in the correct format to an
 * existing URL.
 *
 * @param {string} url URL to append parameters to
 * @param {ViewerParameters=} parameters Viewer parameters to append
 * @return {string} URL with appended parameters
 */
export function appendParametersToURL(
  url: string,
  parameters?: ViewerParameters
): string {
  if (!parameters) {
    return url;
  }
  return url + '#' + parametersToString(parameters);
}

function parametersToString(parameters: ViewerParameters): string {
  const output = [];
  for (const key of Object.keys(parameters)) {
    // cast to 'any' to allow [] access
    // tslint:disable:no-any
    let value = (parameters as any)[key];
    if (typeof value === 'undefined') {
      continue;
    }
    if (typeof value === 'boolean') {
      value = value ? 1 : 0;
    }
    output.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }
  return output.join('&');
}
