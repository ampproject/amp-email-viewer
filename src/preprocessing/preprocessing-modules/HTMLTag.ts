import { Config } from '../../config';
import { parseHTML, serializeHTML } from '../../util';

const HTML_ATTRIBUTES = [
  'allow-xhr-interception',
  'allow-viewer-render-template',
  'report-errors-to-viewer',
];

/**
 * Adds attributes to the <html> tag which affect which features are allowed by
 * the AMP viewer.
 *
 * @param {string} amp AMP code to modify <html> tag of
 * @param {!Config} config Global config
 * @return {string} Modified AMP code
 */
function process(amp: string, config: Config): string {
  const doc = parseHTML(amp);

  const tags = doc.getElementsByTagName('html');
  if (tags.length !== 1) {
    throw new Error('Failed to find <html> tag inside AMP document');
  }
  const html = tags[0];

  for (const attr of HTML_ATTRIBUTES) {
    html.setAttribute(attr, '');
  }

  return serializeHTML(doc);
}

export const module = {
  name: 'HTMLTag',
  process,
};
