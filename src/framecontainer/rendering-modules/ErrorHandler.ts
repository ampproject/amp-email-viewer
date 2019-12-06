import { FrameContainer } from '../FrameContainer';
import { Messaging } from '@ampproject/viewer-messaging';
import { Config } from '../../config';

/**
 * Reacts to errors received from the AMP document and cancels loading if an
 * unexpected error happens in a short period after the document loads.
 */
class ErrorHandlerImpl {
  private frameContainer: FrameContainer;
  private config: Config;
  private messaging: Messaging;
  private loadErrorRejector: ((error: AMPError) => void) | null = null;

  constructor(frameContainer: FrameContainer) {
    this.frameContainer = frameContainer;
    this.messaging = frameContainer.getMessaging();
    this.config = frameContainer.getConfig();
  }

  start(): void {
    this.messaging.registerHandler('error', this.errorHandler);
  }

  private errorHandler = (
    name: string,
    data: AMPError,
    rsvp: boolean
  ): Promise<void> => {
    if (
      this.loadErrorRejector &&
      data.a === ErrorType.Developer &&
      data.ex === ErrorExpectancy.Unexpected
    ) {
      this.loadErrorRejector(data);
    }
    return Promise.resolve();
  };

  private async checkForLoadErrors() {
    try {
      await new Promise((resolve, reject) => {
        this.loadErrorRejector = reject;
        setTimeout(() => resolve, this.config.failOnLoadErrorAfter);
      });
    } catch (error) {
      this.frameContainer.reportError(error.m);
    }
    this.loadErrorRejector = null;
  }

  documentLoaded(): void {
    if (!this.config.failOnLoadErrorAfter) {
      return;
    }
    this.checkForLoadErrors();
  }

  documentUnloaded(): void {}
}

interface AMPError {
  // message
  m: string;

  // user or developer error
  a: ErrorType;

  // expected or unexpected error
  ex: ErrorExpectancy;

  // runtime version
  v: string;

  // detected JS engine
  jse: string;

  // error stack
  s: string | undefined;

  // tag name that caused the error
  el: string | undefined;
}

enum ErrorType {
  Developer = '0',
  User = '1',
}

enum ErrorExpectancy {
  Unexpected = '0',
  Expected = '1',
}

function load(frameContainer: FrameContainer) {
  const impl = new ErrorHandlerImpl(frameContainer);
  impl.start();
  return impl;
}

export const module = {
  name: 'ErrorHandler',
  load,
};
