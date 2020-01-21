import { Config } from '../config';
import {
  validationModules,
  transformingModules,
} from './preprocessing-modules/index';
import { parseHTMLDocument, serializeHTML } from '../util';

/**
 * Runs the preprocessing modules on the given AMP code.
 *
 * @param {string} amp AMP code to preprocess
 * @param {!Config} config Global config
 * @param {Array<string>=} modules Module whitelist (leave empty to run all)
 * @return {!Promise<string>} Preprocessed AMP code
 */
export async function preprocessAMP(
  amp: string,
  config: Config
): Promise<string> {
  const skipSet = new Set(config.skipPreprocessingModules || []);
  const doc = parseHTMLDocument(amp);

  const errors = [];
  for (const module of validationModules) {
    if (skipSet.has(module.name)) {
      continue;
    }
    if (module.validateEnvironment) {
      const err = await module.validateEnvironment(config);
      if (err) {
        throw err;
      }
    }
    if (module.validateText) {
      const err = await module.validateText(amp, config);
      if (err) {
        throw err;
      }
    }
    if (module.validateDocument) {
      const err = await module.validateDocument(doc, config);
      if (err) {
        throw err;
      }
    }
  }

  for (const module of transformingModules) {
    if (skipSet.has(module.name)) {
      continue;
    }
    await module.transform(doc, config);
  }

  return serializeHTML(doc);
}
