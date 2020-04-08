export const urls = {
  // Path where the AMP runtime is hosted
  cdn: 'https://example.com/modules/amp-runtime',
  // Regex that matches hostname of where the viewer will be used
  trustedViewerHosts: [/^example\.com$/],

  // In most cases, these can remain unchanged
  localhostRegex: /^https?:\/\/localhost(:\d+)?$/,
  cdnProxyRegex: /a^/, // matches nothing
  localDev: false,
  errorReporting: null,
  geoApi: null,
  thirdPartyFrameRegex: null,
  thirdPartyFrameHost: null,
  thirdParty: null,
};

export const config = {
  urls,
};
