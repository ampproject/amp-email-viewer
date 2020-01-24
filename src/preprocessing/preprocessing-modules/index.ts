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
import { module as ElementLimits } from './ElementLimits';
import { module as BrowserDetection } from './BrowserDetection';
import { module as SizeCheck } from './SizeCheck';
import { module as HTMLTag } from './HTMLTag';
import { module as HeadTag } from './HeadTag';
import { module as RuntimeRewrite } from './RuntimeRewrite';
import { module as HyperlinkRewrite } from './HyperlinkRewrite';
import { module as ImageURLRewrite } from './ImageURLRewrite';
import { module as CSS } from './CSS';

export const validationModules: ValidationModule[] = [
  SizeCheck,
  ValidateAMP,
  ElementLimits,
];
export const transformingModules: TransformingModule[] = [
  HTMLTag,
  HeadTag,
  RuntimeRewrite,
  HyperlinkRewrite,
  ImageURLRewrite,
  CSS,
];
