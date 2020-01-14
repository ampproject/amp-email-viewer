import { Config } from '../config';
import { modules as preprocessingModules } from './preprocessing-modules/index';
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
  const modules = preprocessingModules.filter(
    module => !skipSet.has(module.name)
  );

  for (const module of modules) {
    if ('processText' in module) {
      amp = await module.processText(amp, config);
    }
  }

  const doc = parseHTMLDocument(amp);
  for (const module of modules) {
    if ('processDocument' in module) {
      await module.processDocument(doc, config);
    }
  }
  return serializeHTML(doc);
}
