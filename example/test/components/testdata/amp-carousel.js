module.exports = {
  name: 'amp-carousel',
  clickSelector: '.amp-carousel-button-next',
  success: () =>
    document.querySelector('#second').getBoundingClientRect().x === 0,
  code: `<!DOCTYPE html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-carousel" src="https://cdn.ampproject.org/v0/amp-carousel-0.1.js"></script>
  <style amp4email-boilerplate>body{visibility:hidden}</style>
</head>
<body>
  <amp-carousel height="100" type="slides">
    <amp-img src="https://amp.dev/static/samples/img/image1.jpg" height="100"></amp-img>
    <amp-img id="second" src="https://amp.dev/static/samples/img/image2.jpg" height="100"></amp-img>
    <amp-img src="https://amp.dev/static/samples/img/image3.jpg" height="100"></amp-img>
  </amp-carousel>
</body>
</html>
`,
};
