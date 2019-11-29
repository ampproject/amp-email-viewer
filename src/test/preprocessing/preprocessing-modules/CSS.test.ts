import { module as CSS } from '../../../preprocessing/preprocessing-modules/CSS';
import { JSDOM } from 'jsdom';

declare global {
  namespace NodeJS {
    interface Global {
      DOMParser: typeof DOMParser;
    }
  }
}

describe('CSS module', () => {
  beforeAll(() => {
    const dom = new JSDOM();
    global.DOMParser = dom.window.DOMParser;
  });

  afterAll(() => {
    delete global.DOMParser;
  });

  test('has correct name', () => {
    expect(CSS.name).toBe('CSS');
  });

  test('strips CSS in strict mode', () => {
    const code = `<!DOCTYPE html>
<html amp4email>
<head>
<style amp-custom>
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

.bad::before {
  content: "hello";
  color: red;
}
.good:enabled {
  color: blue;
}
@import 'custom.css';
@media screen and (min-width: 900px) {
  .good {
    padding: 1rem 3rem;
  }
}
@media (grid: 0) {
  .bad {
    padding: 1rem 3rem;
  }
}
@document url("https://www.example.com/") {
  .bad {
    color: red;
  }
}
@font-face {
  font-family: "Open Sans";
}
</style>
</head>
<body>Hello, world!</body>
</html>`;

    // tslint:disable:no-any
    const out = CSS.process(code, {
      strictCSSValidation: true,
    } as any);
    expect(out).toBe(`<!DOCTYPE html>
<html amp4email=""><head>
<style amp-custom="">.good{cursor:pointer;filter:blur(5px);transition:opacity 1s;visibility:hidden;z-index:50}.bad{}.good:enabled{color:blue}@media screen and (min-width:900px){.good{padding:1rem 3rem}}</style>
</head>
<body>Hello, world!
</body></html>`);
  });
});
