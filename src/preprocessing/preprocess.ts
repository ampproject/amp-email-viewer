import { Config } from '../config';
import { modules as preprocessingModules } from './preprocessing-modules/index';

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
  config: Config,
  modules?: string[]
): Promise<string> {
  const moduleSet = new Set(modules || []);
  for (const module of preprocessingModules) {
    if (modules && !moduleSet.has(module.name)) {
      continue;
    }
    amp = await module.process(amp, config);
  }
  return amp;
}
