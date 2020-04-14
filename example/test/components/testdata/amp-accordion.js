module.exports = {
  name: 'amp-accordion',
  clickSelector: '#click',
  success: '#click[expanded]',
  code: `<!DOCTYPE html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-accordion" src="https://cdn.ampproject.org/v0/amp-accordion-0.1.js"></script>
  <style amp4email-boilerplate>body{visibility:hidden}</style>
</head>
<body>
  <amp-accordion>
    <section id="click">
      <h4>Section 1</h4>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </section>
    <section>
      <h4>Section 2</h4>
      <div>Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer placerat dapibus sem. Duis rutrum tristique quam, et pulvinar urna. Praesent eget quam dui. Vivamus egestas posuere lorem, ut tempus magna aliquam et. Nulla eu sagittis mauris. Aliquam tincidunt id turpis sit amet consectetur. Phasellus sit amet dignissim felis. Quisque lobortis, eros scelerisque aliquet tincidunt, quam tellus pulvinar lorem, vitae porta nulla velit at turpis. Aliquam erat volutpat.</div>
    </section>
  </amp-accordion>
</body>
</html>
`,
};
