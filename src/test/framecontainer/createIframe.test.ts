import { JSDOM } from 'jsdom';

import { createIframe } from '../../framecontainer/createIframe';

test('createIframe() creates iframe', () => {
  const { document } = new JSDOM('').window;
  const div = document.createElement('div');
  document.body.appendChild(div);
  const iframe = createIframe(div, {
    src: 'about:blank',
    width: '1',
    height: '1',
  });
  expect(iframe).toBe(div.querySelector('iframe'));
  expect(iframe.src).toBe('about:blank');
});
