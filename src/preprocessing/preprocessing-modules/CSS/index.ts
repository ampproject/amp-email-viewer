import { Config } from '../../../config';
import {
  parseHTML,
  serializeHTML,
  isValidURL,
  rewriteURLUsingPlaceholder,
} from '../../../util';
import * as csstree from 'css-tree';
import {
  ALLOWED_ATRULES,
  ALLOWED_MEDIA_FEATURES,
  ALLOWED_PSEUDO_CLASS_SELECTORS,
  ALLOWED_TRANSITIONS,
  ALLOWED_URL_PROPERTIES,
  ALLOWED_PROPERTIES,
} from './whitelist';

const CUSTOM_STYLES_SELECTOR = 'style[amp-custom]';
const INLINE_STYLES_SELECTOR = '[style]';

/**
 * Parses the CSS of the AMP document.
 *
 * @param {string} amp AMP code to parse CSS of
 * @param {!Config} config Global config
 * @return {string} Modified AMP code
 */
function process(amp: string, config: Config): string {
  const doc = parseHTML(amp);

  processStyleTag(doc, config);
  processInlineStyles(doc, config);

  return serializeHTML(doc);
}

function processStyleTag(doc: HTMLDocument, config: Config) {
  const styleTag = doc.querySelector(CUSTOM_STYLES_SELECTOR);
  if (!styleTag || !styleTag.textContent) {
    return;
  }

  const ast = csstree.parse(styleTag.textContent);
  if (config.strictCSSSanitization) {
    pruneAtrules(ast);
    pruneMediaQueries(ast);
    prunePseudoSelectors(ast);
    pruneProperties(ast);
  }
  if (config.imageProxyURL) {
    parseURLs(ast, config.imageProxyURL);
  }
  styleTag.textContent = csstree.generate(ast);
}

function processInlineStyles(doc: HTMLDocument, config: Config) {
  const tagsWithStyle = doc.querySelectorAll(INLINE_STYLES_SELECTOR);
  if (!tagsWithStyle || tagsWithStyle.length === 0) {
    return;
  }

  for (const tag of Array.from(tagsWithStyle)) {
    const style = tag.getAttribute('style');
    if (!style) {
      continue;
    }
    const ast = csstree.parse(style, { context: 'declarationList' });
    if (config.strictCSSSanitization) {
      pruneProperties(ast);
    }
    if (config.imageProxyURL) {
      parseURLs(ast, config.imageProxyURL);
    }
    tag.setAttribute('style', csstree.generate(ast));
  }
}

function pruneAtrules(ast: csstree.CssNode) {
  csstree.walk(ast, {
    visit: 'Atrule',
    enter: (node, item, list) => {
      if (!ALLOWED_ATRULES.has(node.name)) {
        list.remove(item);
      }
    },
  });
}

function pruneMediaQueries(ast: csstree.CssNode) {
  csstree.walk(ast, {
    visit: 'Atrule',
    enter: (node, item, list) => {
      if (
        node.name === 'media' &&
        csstree.find(
          node.prelude!,
          node =>
            node.type === 'MediaFeature' &&
            !ALLOWED_MEDIA_FEATURES.has(csstree.keyword(node.name).basename)
        )
      ) {
        list.remove(item);
      }
    },
  });
}

function prunePseudoSelectors(ast: csstree.CssNode) {
  csstree.walk(ast, {
    visit: 'Rule',
    enter: (node, item, list) => {
      if (
        csstree.find(
          node.prelude!,
          node =>
            node.type === 'PseudoElementSelector' ||
            (node.type === 'PseudoClassSelector' &&
              !ALLOWED_PSEUDO_CLASS_SELECTORS.has(node.name))
        )
      ) {
        list.remove(item);
      }
    },
  });
}

function pruneProperties(ast: csstree.CssNode) {
  csstree.walk(ast, {
    visit: 'Declaration',
    enter: (node, item, list) => {
      if (shouldRemoveProperty(node)) {
        list.remove(item);
      }
    },
  });
}

function shouldRemoveProperty(node: csstree.Declaration): boolean {
  return (
    !ALLOWED_PROPERTIES.has(node.property) || shouldRemoveSpecialProperty(node)
  );
}

function shouldRemoveSpecialProperty(node: csstree.Declaration): boolean {
  const value = extractValue(node.value);
  switch (node.property) {
    case 'cursor':
      return value !== 'pointer' && value !== 'initial';
    case 'visibility':
      return value !== 'hidden' && value !== 'visible' && value !== 'initial';
    case 'z-index':
      const valueNum = Number(value);
      return value === '' || valueNum < -100 || valueNum > 100;
    case 'filter':
      if (node.value.type !== 'Value') {
        return true;
      }
      return node.value.children.some(child => child.type === 'Url');
    case 'transition':
      if (node.value.type !== 'Value') {
        return true;
      }
      return node.value.children.some(
        child =>
          child.type === 'Identifier' && !ALLOWED_TRANSITIONS.has(child.name)
      );
    default:
      return false;
  }
}

function parseURLs(ast: csstree.CssNode, proxy: string) {
  csstree.walk(ast, {
    visit: 'Declaration',
    enter: (node, item, list) => {
      let remove = false;
      csstree.walk(node, {
        visit: 'Url',
        enter: urlNode => {
          if (!ALLOWED_URL_PROPERTIES.has(node.property)) {
            remove = true;
            return;
          }
          if (urlNode.value.type !== 'String') {
            remove = true;
            return;
          }
          const url = processURL(urlNode.value.value);
          if (!url) {
            remove = true;
            return;
          }

          const newURL = rewriteURLUsingPlaceholder(url, proxy);
          urlNode.value.value = JSON.stringify(newURL);
        },
      });
      if (remove) {
        list.remove(item);
      }
    },
  });
}

function processURL(url: string): string | null {
  // strip quotes
  url = url.replace(/^['"]/, '').replace(/['"]$/, '');
  if (!isValidURL(url)) {
    return null;
  }
  return url;
}

function extractValue(node: csstree.Value | csstree.Raw): string | null {
  if (node.type === 'Raw') {
    return node.value;
  }
  const { children } = node;
  if (children.getSize() !== 1) {
    return null;
  }
  const first = children.first() as csstree.CssNode;
  switch (first.type) {
    case 'Number':
      return first.value;
    case 'Identifier':
      return first.name;
    default:
      return null;
  }
}

export const module = {
  name: 'CSS',
  process,
};
