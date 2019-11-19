import { FrameContainer } from '@ampproject/email-viewer/dist/viewer.mjs';

window.ampCode = window.ampCode || `<!doctype html>
<html ⚡4email allow-xhr-interception allow-viewer-render-template report-errors-to-viewer>
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async src="https://cdn.ampproject.org/v0/amp-viewer-integration-0.1.js"></script>
  <style amp4email-boilerplate>body{visibility:hidden}</style>
</head>
<body>
  Hello, AMP4EMAIL world.
</body>
</html>
`;

const container = document.querySelector('#viewer');
const viewer = new FrameContainer(container, {
  relayPageURL: process.env.CONFIG_RELAY_PAGE_URL,
  useOpaqueOrigin: Boolean(process.env.CONFIG_USE_OPAQUE_ORIGIN),
  imageProxyURL: process.env.CONFIG_IMAGE_PROXY_URL,
});
viewer.render(window.ampCode);
