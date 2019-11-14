import test from 'ava';
import * as sinon from 'sinon';

import { module as IframeHeight } from '../../../framecontainer/rendering-modules/IframeHeight';

test('IframeHeight resizes iframe', async t => {
  t.assert(IframeHeight.name === 'IframeHeight');

  const iframe = {
    setAttribute: sinon.spy(),
  };
  const messaging = {
    registerHandler: sinon.spy(),
  };
  const frameContainer = {
    getIframe: () => iframe,
    getMessaging: () => messaging,
  };

  // tslint:disable:no-any
  IframeHeight.load(frameContainer as any);
  t.assert(messaging.registerHandler.calledWith('documentHeight'));
  const handler = messaging.registerHandler.lastCall.args[1];
  handler('documentHeight', { height: 20 }, false);
  t.assert(iframe.setAttribute.calledWithExactly('height', '20'));
});
