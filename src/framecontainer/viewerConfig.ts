import {
  ViewerParameters,
  ViewerCapability,
  ViewerVisibilityState,
} from './viewerParameters';

/**
 * Feature-Policy of the iframe that displays an AMP page.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy}
 */
export const IFRAME_FEATURE_POLICY = [
  "autoplay 'none'",
  "camera 'none'",
  "encrypted-media 'none'",
  "fullscreen 'none'",
  "geolocation 'none'",
  "gyroscope 'none'",
  "magnetometer 'none'",
  "microphone 'none'",
  "midi 'none'",
  "payment 'none'",
  "speaker 'none'",
  "sync-xhr 'none'",
  "vr 'none'",
];

/**
 * Default sandbox attributes of the iframe that displays an AMP page.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe}
 */
export const IFRAME_SANDBOX = [
  'allow-scripts',
  'allow-forms',
  'allow-popups',
  'allow-popups-to-escape-sandbox',
];

/**
 * Default styles applied to the iframe that displays an AMP page.
 */
export const IFRAME_STYLES = ['border: none', 'overflow: hidden'];

/**
 * Default viewer parameters used for the AMP viewer.
 */
export const VIEWER_PARAMETERS: ViewerParameters = {
  prerenderSize: 0,
  visibilityState: ViewerVisibilityState.VISIBLE,
  paddingTop: 0,
  history: true,
  p2r: false,
  horizontalScrolling: false,
  storage: true,
  development: true,
  log: false,
  csi: true,
  cap: [
    ViewerCapability.VIEWER_RENDER_TEMPLATE,
    ViewerCapability.ERROR_REPORTER,
    ViewerCapability.XHR_INTERCEPTOR,
  ],
};

/**
 * Rendering modules used by default.
 */
export const DEFAULT_RENDERING_MODULES = [
  'IframeHeight',
  'XHRProxy',
  'ViewerRenderProxy',
];
