import { Config } from '../../config';
import { DocumentPreprocessingModule } from './index';

const HTML_ATTRIBUTES = [
  'allow-xhr-interception',
  'allow-viewer-render-template',
  'report-errors-to-viewer',
];

/**
 * Adds attributes to the <html> tag which affect which features are allowed by
 * the AMP viewer.
 *
 * @param {!Document} doc AMP document to modify <html> tag of
 * @param {!Config} config Global config
 */
function process(doc: DocumentFragment, config: Config) {
  const tags = doc.querySelectorAll('html');
  if (tags.length !== 1) {
    throw new Error('Failed to find <html> tag inside AMP document');
  }
  const html = tags[0];

  for (const attr of HTML_ATTRIBUTES) {
    html.setAttribute(attr, '');
  }
}

export const module: DocumentPreprocessingModule = {
  name: 'HTMLTag',
  processDocument: process,
};
