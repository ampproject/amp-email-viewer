import {
  ViewerParameters,
  ViewerCapability,
  ViewerVisibilityState,
} from './viewerParameters';

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

export const IFRAME_SANDBOX = [
  'allow-scripts',
  'allow-forms',
  'allow-popups',
  'allow-popups-to-escape-sandbox',
];

export const IFRAME_STYLES = ['border: none', 'overflow: hidden'];

export const VIEWER_PARAMETERS: ViewerParameters = {
  prerenderSize: 0,
  visibilityState: ViewerVisibilityState.VISIBLE,
  paddingTop: 0,
  history: true,
  p2r: false,
  horizontalScrolling: false,
  storage: true,
  development: false,
  log: false,
  csi: true,
  cap: [ViewerCapability.VIEWER_RENDER_TEMPLATE],
};

export const DEFAULT_RENDERING_MODULES = ['IframeHeight'];
