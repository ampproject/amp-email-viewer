import { Config } from '../../config';

export type PreprocessingModule =
  | DocumentPreprocessingModule
  | TextPreprocessingModule;

export interface DocumentPreprocessingModule {
  name: string;
  processDocument: (
    doc: DocumentFragment,
    config: Config
  ) => void | Promise<void>;
}

export interface TextPreprocessingModule {
  name: string;
  processText: (text: string, config: Config) => string | Promise<string>;
}

import { module as Validator } from './Validator';

export const modules: PreprocessingModule[] = [Validator];
