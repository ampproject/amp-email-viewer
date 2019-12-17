import { Config } from '../../config';

/**
 * Throws if the given code is too large according to the config.
 *
 * @param {string} amp AMP code to check the size of
 * @param {!Config} config Global config
 * @return {string} AMP code of valid size
 */
function process(amp: string, config: Config): string {
  if (!config.maximumAMPSize) {
    return amp;
  }
  const encoder = new TextEncoder();
  const len = encoder.encode(amp).length;
  if (len > config.maximumAMPSize) {
    throw new Error('AMP code exceeds maximum allowed size');
  }
  return amp;
}

export const module = {
  name: 'SizeCheck',
  process,
};
