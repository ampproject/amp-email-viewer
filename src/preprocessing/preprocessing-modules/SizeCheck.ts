import { Config } from '../../config';

/**
 * Throws if the given code is too large according to the config.
 *
 * @param {string} amp AMP code to check the size of
 * @param {!Config} config Global config
 * @return {string} AMP code of valid size
 */
function validateText(amp: string, config: Config): Error | null {
  if (!config.maximumAMPSize) {
    return null;
  }
  const encoder = new TextEncoder();
  const len = encoder.encode(amp).length;
  if (len > config.maximumAMPSize) {
    return new Error('AMP code exceeds maximum allowed size');
  }
  return null;
}

export const module = {
  name: 'SizeCheck',
  validateText,
};
