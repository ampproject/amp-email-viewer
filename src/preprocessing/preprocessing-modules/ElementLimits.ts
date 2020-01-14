import { Config } from '../../config';
import { DocumentPreprocessingModule } from './index';

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
 * @param {!Document} doc AMP document to check the elements of
 * @param {!Config} config Global config
 */
function process(doc: DocumentFragment, config: Config) {
  for (const selector of Object.keys(LIMITS)) {
    const elements = doc.querySelectorAll(selector);
    if (elements.length > LIMITS[selector]) {
      throw new Error('Element limit exceeded');
    }
  }
}

export const module: DocumentPreprocessingModule = {
  name: 'ElementLimits',
  processDocument: process,
};
