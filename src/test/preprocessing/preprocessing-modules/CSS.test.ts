import { module as CSS } from '../../../preprocessing/preprocessing-modules/CSS';
import { parseHTML } from '../../../preprocessing/util';
import * as csstree from 'css-tree';

describe('CSS module', () => {
  test('has correct name', () => {
    expect(CSS.name).toBe('CSS');
  });

  test('atrules', () => {
    cssTest({
      input: `
        @media screen{}
        @media (min-width: 500px) {}
        @media (min-color: 8) {}
        @supports (display: grid) {}
        @document url("https://www.example.com/") {}
        @page :first {}
        @font-face {}
        @keyframes slidein {}
        @counter-style thumbs {}
        @something-else {}
      `,
      output: `
        @media screen{}
        @media (min-width: 500px) {}
      `,
      config: { strictCSSValidation: true },
    });
  });

  test('pseudo-classes and pseudo-elements', () => {
    cssTest({
      input: `
        .good:active {}
        .good:checked {}
        .good:default {}
        .good:disabled {}
        .good:empty {}
        .good:enabled {}
        .good:first-child {}
        .good:first-of-type {}
        .good:focus {}
        .good:focus-within {}
        .good:hover {}
        .good:indeterminate {}
        .good:in-range {}
        .good:invalid {}
        .good:last-child {}
        .good:last-of-type {}
        .good:not(div) {}
        .good:nth-last-of-type(2) {}
        .good:nth-of-type(2) {}
        .good:only-child {}
        .good:only-of-type {}
        .good:optional {}
        .good:out-of-range {}
        .good:read-only {}
        .good:read-write {}
        .good:required {}
        .good:valid {}
        .bad:defined {}
        .bad:first {}
        .bad:host {}
        .bad:lang(en) {}
        .bad:left {}
        .bad:link {}
        .bad:right {}
        .bad:root {}
        .bad:scope {}
        .bad:target {}
        .bad:visited {}
        .bad::before {}
        .bad::after {}
      `,
      output: `
        .good:active {}
        .good:checked {}
        .good:default {}
        .good:disabled {}
        .good:empty {}
        .good:enabled {}
        .good:first-child {}
        .good:first-of-type {}
        .good:focus {}
        .good:focus-within {}
        .good:hover {}
        .good:indeterminate {}
        .good:in-range {}
        .good:invalid {}
        .good:last-child {}
        .good:last-of-type {}
        .good:not(div) {}
        .good:nth-last-of-type(2) {}
        .good:nth-of-type(2) {}
        .good:only-child {}
        .good:only-of-type {}
        .good:optional {}
        .good:out-of-range {}
        .good:read-only {}
        .good:read-write {}
        .good:required {}
        .good:valid {}
      `,
      config: { strictCSSValidation: true },
    });
  });

  test('properties', () => {
    cssTest({
      input: `
        .good {
          color: red;
          display: flex;
          float: left;
        }
        .bad {
          foo: bar;
        }
      `,
      output: `
        .good {
          color: red;
          display: flex;
          float: left;
        }
        .bad {}
      `,
      config: { strictCSSValidation: true },
    });
  });

  test('special properties', () => {
    cssTest({
      input: `
        .good {
          cursor: pointer;
          filter: blur(5px);
          transition: opacity 1s;
          visibility: hidden;
          z-index: 50;
        }
        .bad {
          cursor: wait;
          filter: url('https://filter.example/');
          transition: max-width 1s;
          visibility: collapse;
          z-index: 1000;
        }
      `,
      output: `
        .good {
          cursor: pointer;
          filter: blur(5px);
          transition: opacity 1s;
          visibility: hidden;
          z-index: 50;
        }
        .bad {}
      `,
      config: { strictCSSValidation: true },
    });
  });

  test('url rewrite', () => {
    cssTest({
      input: `
        .good {
          background: no-repeat url("https://images.example/img.jpg");
          background-image: url('https://images.example/img.jpg');
        }
        .bad {
          background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==);
          color: url('https://images.example/img.jpg');
        }
      `,
      output: `
        .good {
          background: no-repeat url("https://placeholder.example/");
          background-image: url("https://placeholder.example/");
        }
        .bad {}
      `,
      config: { imageProxyURL: 'https://proxy.example/' },
    });
  });

  test('inline styles', () => {
    const input = `<!DOCTYPE html>
<html><head></head><body>
<p style="background-image: url('https://images.example/img.jpg'); z-index: 1000; color: red; foo: bar">Hello</p>
</body></html>`;
    // tslint:disable:no-any
    const out = CSS.process(input, {
      imageProxyURL: 'https://proxy.example/',
      strictCSSValidation: true,
    } as any);
    expect(out).toBe(`<!DOCTYPE html>
<html><head></head><body>
<p style="background-image:url(&quot;https://placeholder.example/&quot;);color:red">Hello</p>
</body></html>`);
  });

  function cssTest({ input = '', output = '', config = {} }) {
    // tslint:disable:no-any
    const out = htmlToCSS(CSS.process(cssToHTML(input), config as any));
    expect(out).toBe(normalizeCSS(output));
  }

  function cssToHTML(css: string) {
    return `<style amp-custom>${css}</style>`;
  }

  function htmlToCSS(html: string): string {
    return parseHTML(html).querySelector('style[amp-custom]')!.textContent!;
  }

  function normalizeCSS(css: string): string {
    return csstree.generate(csstree.parse(css));
  }
});
