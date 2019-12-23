import { FrameContainer } from '../FrameContainer';

export interface ModuleInstance {
  documentLoaded(): void;
  documentUnloaded(): void;
}

interface RenderingModule {
  name: string;
  load: (frameContainer: FrameContainer) => ModuleInstance;
}

import { module as IframeHeight } from './IframeHeight';
import { module as ErrorHandler } from './ErrorHandler';

export const modules: RenderingModule[] = [IframeHeight, ErrorHandler];
