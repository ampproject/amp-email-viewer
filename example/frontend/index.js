import { FrameContainer, preprocessAMP } from '@ampproject/email-viewer/dist/viewer.mjs';

window.ampCode =
  window.ampCode ||
  `<!DOCTYPE html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <style amp4email-boilerplate>body{visibility:hidden}</style>
</head>
<body>
  Hello, AMP4EMAIL world.
</body>
</html>
`;

window.ampContainerConfig = Object.assign({
  relayPageURL: process.env.CONFIG_RELAY_PAGE_URL,
  useOpaqueOrigin: Boolean(process.env.CONFIG_USE_OPAQUE_ORIGIN),
  imageProxyURL: process.env.CONFIG_IMAGE_PROXY_URL,
  xhrProxyURL: process.env.CONFIG_XHR_PROXY_URL,
  templateProxyURL: process.env.CONFIG_TEMPLATE_PROXY_URL,
  linkRedirectURL: process.env.CONFIG_LINK_REDIRECT_URL,
  loadTimeout: 3000,
}, window.ampContainerConfig || {});


(async function() {
  const config = window.ampContainerConfig;
  const container = document.querySelector('#viewer');
  const viewer = new FrameContainer(container, config, 'sender@example.com');
  const code = await preprocessAMP(window.ampCode, config);
  viewer.render(code);
})();
