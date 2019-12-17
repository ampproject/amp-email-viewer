import { Config } from '../../config';
import { parseHTML } from '../../util';

/**
 * Mapping between selector and maximum number of elements matching that
 * selector.
 *
 * Based on https://github.com/ampproject/wg-amp4email/issues/4
 */
const LIMITS: { [key: string]: number } = {
  'amp-state': 5,
  'amp-form': 20,
  'amp-img, amp-anim': 200,
  'amp-list': 20,
};

/**
 * Throws if the given AMP code exceeds the element limits.
 *
 * @param {string} amp AMP code to check the elements of
 * @param {!Config} config Global config
 * @return {string} AMP code with valid element counts
 */
function process(amp: string, config: Config): string {
  const doc = parseHTML(amp);
  for (const selector of Object.keys(LIMITS)) {
    const elements = doc.querySelectorAll(selector);
    if (elements.length > LIMITS[selector]) {
      throw new Error('Element limit exceeded');
    }
  }
  return amp;
}

export const module = {
  name: 'ElementLimits',
  process,
};
