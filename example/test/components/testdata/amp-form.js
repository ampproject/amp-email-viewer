module.exports = {
  name: 'amp-form',
  clickSelector: 'input[type=submit]',
  loadSelector: 'form.i-amphtml-form',
  success: () =>
    document.querySelectorAll('input[value="Hello, foo!"]').length === 3 &&
    document.querySelectorAll('input[value="Invalid input"]').length === 1,
  code: `<!DOCTYPE html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-form" src="https://cdn.ampproject.org/v0/amp-form-0.1.js"></script>
  <script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"></script>
  <style amp4email-boilerplate>body{visibility:hidden}</style>
</head>
<body>
  <form method="post" action-xhr="https://amp.dev/documentation/examples/api/hello">
    <input type="hidden" name="name" value="foo">
    <input type="submit">
    <div submit-success>
      <template type="amp-mustache">
        <input class="output1" type="text" value="{{message}}">
      </template>
    </div>
  </form>
  <form method="post" action-xhr="https://amp.dev/documentation/examples/api/hello">
    <input type="hidden" name="name" value="foo">
    <input type="submit">
    <div submit-success>
      <script type="text/plain" template="amp-mustache">
        <input class="output2" type="text" value="{{message}}">
      </script>
    </div>
  </form>
  <form method="get" action-xhr="https://amp.dev/documentation/examples/api/hello">
  <input type="hidden" name="name" value="foo">
    <input type="submit">
    <div submit-success>
      <template type="amp-mustache">
        <input class="output3" type="text" value="{{message}}">
      </template>
    </div>
  </form>
  <form method="post" action-xhr="https://amp.dev/documentation/examples/api/hello">
    <input type="hidden" name="name" value="">
    <input type="submit">
    <div submit-error>
      <template type="amp-mustache">
        <input class="output4" type="text" value="{{error}}">
      </template>
    </div>
  </form>
</body>
</html>
`,
};
