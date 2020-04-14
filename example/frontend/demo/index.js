import {
  FrameContainer,
  preprocessAMP,
  validateConfig,
} from '@ampproject/email-viewer/dist/viewer.mjs';

const initialAMP = `<!DOCTYPE html>
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

const config = {
  relayPageURL: 'http://localhost:3000/modules/bootstrap-page?disableCSP',
  useOpaqueOrigin: true,
  imageProxyURL: 'http://localhost:3000/modules/image-proxy?url=%s',
  xhrProxyURL: 'http://localhost:3000/modules/xhr-proxy',
  templateProxyURL: 'http://localhost:3000/modules/mustache-render',
  transformTemplateProxyOutput: true,
  linkRedirectURL: 'http://localhost:3000/modules/link-redirect?url=%s',
  failOnLoadErrorAfter: 1000,
  loadTimeout: 3000,
  rtvPin: '',
  runtimeCDN: 'http://localhost:3000/modules/amp-runtime',
  skipPreprocessingModules: [],
  maximumAMPSize: 100000,
  strictCSSSanitization: true,
  developmentMode: true,
};

const elContainer = document.querySelector('#viewer');
const elInput = document.querySelector('#input');
const elProcessed = document.querySelector('#processed');
const elRender = document.querySelector('#render');
const elConfig = document.querySelector('#config');

function buildControls() {
  for (const key of Object.keys(config)) {
    elConfig.appendChild(buildControl(key));
  }
}

function buildControl(key) {
  const value = config[key];
  const p = document.createElement('p');
  let input;
  switch (typeof value) {
    case 'boolean':
      p.innerHTML = `<label><input type="checkbox">${key}</label>`;
      input = p.querySelector('input');
      input.checked = value;
      input.addEventListener('change', (event) =>
        updateConfig(key, event.target.checked)
      );
      return p;
    case 'string':
      p.innerHTML = `<label>${key}:&nbsp;<input type="text"></label>`;
      input = p.querySelector('input');
      input.value = value;
      input.addEventListener('change', (event) =>
        updateConfig(key, event.target.value)
      );
      return p;
    case 'object':
      p.innerHTML = `<label>${key}:&nbsp;<input type="text"></label>`;
      input = p.querySelector('input');
      input.value = value;
      input.addEventListener('change', (event) =>
        updateConfig(key, event.target.value.replace(/\s+/g, '').split(','))
      );
      return p;
    case 'number':
      p.innerHTML = `<label>${key}:&nbsp;<input type="number"></label>`;
      input = p.querySelector('input');
      input.value = String(value);
      input.addEventListener('change', (event) =>
        updateConfig(key, Number(event.target.value))
      );
      return p;
  }
}

function updateConfig(key, value) {
  if (value !== false && !value) {
    delete config[key];
  } else {
    config[key] = value;
  }
  if (validateConfig(config)) {
    elConfig.classList.remove('invalid');
  } else {
    elConfig.classList.add('invalid');
  }
}

async function render() {
  elContainer.innerHTML = '';
  if (!validateConfig(config)) {
    return;
  }
  console.log(config);
  const viewer = new FrameContainer(elContainer, config, 'sender@example.com');
  elProcessed.classList.remove('error');
  try {
    const code = await preprocessAMP(elInput.value, config);
    elProcessed.value = code;
    viewer.render(code);
  } catch (error) {
    elProcessed.classList.add('error');
    elProcessed.value = error;
  }
}

(function () {
  elInput.value = initialAMP;
  buildControls();
  elRender.addEventListener('click', render);
  render();
})();
