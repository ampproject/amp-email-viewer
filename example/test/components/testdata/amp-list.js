module.exports = {
  name: 'amp-list',
  success: () =>
    !!document.querySelector('p.output1') &&
    document.querySelectorAll('p.output2').length === 2 &&
    !!document.querySelector('p.output3') &&
    !!document.querySelector('.output4') &&
    document
      .querySelector('.output4 > amp-img')
      .getAttribute('src')
      .startsWith('http://localhost:3000/modules/image-proxy?') &&
    document
      .querySelector('.output4 > div')
      .style.backgroundImage.startsWith(
        'url("http://localhost:3000/modules/image-proxy?'
      ) &&
    document
      .querySelector('.output4 > a')
      .getAttribute('href')
      .startsWith('http://localhost:3000/modules/link-redirect?'),
  code: `<!DOCTYPE html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-list" src="https://cdn.ampproject.org/v0/amp-list-0.1.js"></script>
  <script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"></script>
  <style amp4email-boilerplate>body{visibility:hidden}</style>
</head>
<body>
  <amp-list height="100" src="https://amp.dev/static/samples/json/cart.json">
    <template type="amp-mustache">
      <p class="output1">{{fullname}}</p>
    </template>
  </amp-list>
  <amp-list height="100" src="https://amp.dev/documentation/examples/api/photo-stream" max-items="2">
    <template type="amp-mustache">
      <p class="output2">{{title}}</p>
    </template>
  </amp-list>
  <amp-list height="100" src="https://amp.dev/static/samples/json/cart.json">
    <script type="text/plain" template="amp-mustache">
      <p class="output3">{{fullname}}</p>
    </script>
  </amp-list>
  <amp-list height="100" src="https://amp.dev/documentation/examples/api/photo-stream" max-items="1">
    <template type="amp-mustache">
      <div class="output4">
        <amp-img src="{{imageUrl}}" height="100"></amp-img>
        <div style="background-image:url('{{imageUrl}}')"></div>
        <a href="{{imageUrl}}">amp.dev</a>
      </div>
    </template>
  </amp-list>
</body>
</html>
`,
};
