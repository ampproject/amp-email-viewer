import test from 'ava';

import IframeHeight from '../../../framecontainer/rendering-modules/IframeHeight';

test('IframeHeight resizes iframe', async t => {
  let handler: any = null;
  const iframe = document.createElement('iframe');
  iframe.setAttribute('height', '1');
  const messaging = {
    registerHandler: (
      type: string,
      callback: (name: string, data: any, rsvp: boolean) => Promise<void>
    ) => {
      t.assert(type === 'documentHeight');
      handler = callback;
    },
  };
  const frameContainer: any = {
    getIframe: () => iframe,
    getMessaging: () => messaging,
  };

  t.assert(IframeHeight.name === 'IframeHeight');
  IframeHeight.load(frameContainer);
  t.assert(handler);
  handler('documentHeight', { height: 20 }, false);
  t.assert(iframe.getAttribute('height') === '20');
});
