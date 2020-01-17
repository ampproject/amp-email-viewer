import { Config } from '../../config';

type OptError = Error | null | Promise<Error | null>;

export interface ValidationModule {
  name: string;
  validateEnvironment?: (config: Config) => OptError;
  validateText?: (text: string, config: Config) => OptError;
  validateDocument?: (doc: DocumentFragment, config: Config) => OptError;
}

export interface TransformingModule {
  name: string;
  transform: (doc: DocumentFragment, config: Config) => void | Promise<void>;
}

import { module as ValidateAMP } from './ValidateAMP';

export const validationModules: ValidationModule[] = [ValidateAMP];
export const transformingModules: TransformingModule[] = [];
