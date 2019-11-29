import { Config } from '../../config';
import { ValidationResult } from 'amphtml-validator';

declare global {
  interface Window {
    amp: {
      validator: Validator;
    };
  }
}

interface Validator {
  validateString(stringToValidate: string, format: string): ValidationResult;
}

const FORMAT = 'AMP4EMAIL';
const VALIDATOR_JS = 'https://cdn.ampproject.org/v0/validator.js';

/**
 * Throws if the given code is not valid AMP.
 *
 * @param {string} amp AMP code to validate
 * @param {!Config} config Global config
 * @return {!Promise<string>} Validated AMP code
 */
async function process(amp: string, config: Config): Promise<string> {
  const validator = await loadValidator();
  const result = validator.validateString(amp, FORMAT);
  if (result.status !== 'PASS') {
    // TODO: add errors inside this object
    throw new Error('AMP validation failed');
  }
  return amp;
}

/**
 * Downloads and loads validator.js is it's not already loaded.
 *
 * @return {!Promise<Validator>} Validator object
 */
function loadValidator(): Promise<Validator> {
  return new Promise(resolve => {
    if (window.amp && window.amp.validator) {
      resolve(window.amp.validator);
      return;
    }
    let script = findValidatorJS();
    if (!script) {
      script = document.createElement('script');
      script.src = VALIDATOR_JS;
      document.body.appendChild(script);
    }
    script!.addEventListener('load', () => resolve(window.amp.validator));
  });
}

/**
 * Finds an existing script tag with validator.js.
 *
 * @return {?HTMLScriptElement} Script element
 */
function findValidatorJS(): HTMLScriptElement | undefined {
  const scripts = Array.from(document.getElementsByTagName('script'));
  return scripts.find(({ src }) => src === VALIDATOR_JS);
}

export const module = {
  name: 'Validator',
  process,
};
