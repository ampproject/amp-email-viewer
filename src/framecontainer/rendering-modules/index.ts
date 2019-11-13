import { FrameContainer } from '../FrameContainer';

interface RenderingModule {
  name: string;
  load: (frameContainer: FrameContainer) => void;
}

import { module as IframeHeight } from './IframeHeight';

export const modules: RenderingModule[] = [IframeHeight];
