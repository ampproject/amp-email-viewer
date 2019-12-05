import { Config } from '../../config';

interface PreprocessingModule {
  name: string;
  process: (amp: string, config: Config) => string | Promise<string>;
}

import { module as Validator } from './Validator';

export const modules: PreprocessingModule[] = [Validator];
