import { module as ImageURLRewrite } from '../../../preprocessing/preprocessing-modules/ImageURLRewrite';

describe('ImageURLRewrite module', () => {
  test('replaces image URLs with proxy', () => {
    const code = `<!DOCTYPE html>
<html amp4email>
<head></head>
<body>
Hello, world!
<amp-img src="https://images.example/img.jpg"></amp-img>
<amp-anim src="https://images.example/anim.gif"></amp-anim>
</body>
</html>`;

    // tslint:disable:no-any
    const out = ImageURLRewrite.process(code, {
      imageProxyURL: 'https://proxy.example/image?url=%s',
    } as any);
    expect(out).toBe(`<!DOCTYPE html>
<html amp4email=""><head></head>
<body>
Hello, world!
<amp-img src="https://proxy.example/image?url=https%3A%2F%2Fimages.example%2Fimg.jpg"></amp-img>
<amp-anim src="https://proxy.example/image?url=https%3A%2F%2Fimages.example%2Fanim.gif"></amp-anim>

</body></html>`);
  });

  test('skips mustache templates', () => {
    const code = `<!DOCTYPE html>
<html amp4email>
<head></head>
<body>
Hello, world!
<amp-img src="{{my_img}}"></amp-img>
<template type="amp-mustache">
  <amp-img src="{{my_img}}"></amp-img>
  <amp-img src="https://images.example/img.jpg"></amp-img>
</template>
</body>
</html>`;

    // tslint:disable:no-any
    const out = ImageURLRewrite.process(code, {
      imageProxyURL: 'https://proxy.example/image?url=%s',
    } as any);
    expect(out).toBe(`<!DOCTYPE html>
<html amp4email=""><head></head>
<body>
Hello, world!
<amp-img src="{{my_img}}"></amp-img>
<template type="amp-mustache">
  <amp-img src="{{my_img}}"></amp-img>
  <amp-img src="https://images.example/img.jpg"></amp-img>
</template>

</body></html>`);
  });

  test('leaves image URLs intact when not configured', () => {
    const code = `<!DOCTYPE html>
<html amp4email>
<head></head>
<body>
Hello, world!
<amp-img src="https://images.example/img.jpg"></amp-img>
<amp-anim src="https://images.example/anim.gif"></amp-anim>
</body>
</html>`;

    // tslint:disable:no-any
    const out = ImageURLRewrite.process(code, {} as any);
    expect(out).toBe(code);
  });
});
