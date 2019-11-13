import test from 'ava';

import { module as IframeHeight } from '../../../framecontainer/rendering-modules/IframeHeight';

test('IframeHeight resizes iframe', async t => {
  let handler: Function | null = null;
  const iframe = document.createElement('iframe');
  iframe.setAttribute('height', '1');
  const messaging = {
    registerHandler: (
      type: string,
      callback: (name: string, data: unknown, rsvp: boolean) => Promise<void>
    ) => {
      t.assert(type === 'documentHeight');
      handler = callback;
    },
  };

  // doesn't fully implement FrameContainer
  // tslint:disable:no-any
  const frameContainer: any = {
    getIframe: () => iframe,
    getMessaging: () => messaging,
  };

  t.assert(IframeHeight.name === 'IframeHeight');
  IframeHeight.load(frameContainer);
  t.assert(handler);
  handler!('documentHeight', { height: 20 }, false);
  t.assert(iframe.getAttribute('height') === '20');
});
