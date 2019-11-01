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

export enum ViewerViewportType {
  NATURAL = 'natural',
  NATURAL_IOS_EMBED = 'natural-ios-embed',
}

export enum ViewerVisibilityState {
  INACTIVE = 'inactive',
  PAUSED = 'paused',
  VISIBLE = 'visible',
  PRERENDER = 'prerender',
  HIDDEN = 'hidden',
}

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
