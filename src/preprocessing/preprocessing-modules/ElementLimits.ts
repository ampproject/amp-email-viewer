import { Config } from '../../config';

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
function validateDocument(doc: DocumentFragment, config: Config): Error | null {
  for (const selector of Object.keys(LIMITS)) {
    const elements = doc.querySelectorAll(selector);
    if (elements.length > LIMITS[selector]) {
      return new Error('Element limit exceeded');
    }
  }
  return null;
}

export const module = {
  name: 'ElementLimits',
  validateDocument,
};
