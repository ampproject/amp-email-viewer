import {FrameContainer} from '../FrameContainer';

interface RenderingModule {
  name: string;
  load: (frameContainer: FrameContainer) => void;
}

import IframeHeight from './IframeHeight';

const modules: RenderingModule[] = [IframeHeight];

export default modules;
