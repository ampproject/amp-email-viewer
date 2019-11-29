import { Config } from '../../config';

interface PreprocessingModule {
  name: string;
  process: (amp: string, config: Config) => string | Promise<string>;
}

export const modules: PreprocessingModule[] = [];
