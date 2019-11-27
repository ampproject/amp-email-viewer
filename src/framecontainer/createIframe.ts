interface IframeOptions {
  src: string;

  width?: string;
  height?: string;
  featurePolicy?: string[] | string;
  sandbox?: string[] | null;
  className?: string;
  styles?: string[] | string;
}

/**
 * Creates an iframe element with the provided options that includes sandbox
 * attributes, feature policy and styles.
 *
 * @param {!HTMLElement} parent Element to create an iframe inside of
 * @param {!IframeOptions} options Options used for the iframe
 * @return {!HTMLIFrameElement} Newly created iframe element
 */
export function createIframe(
  parent: HTMLElement,
  options: IframeOptions
): HTMLIFrameElement {
  const doc = parent.ownerDocument;
  const iframe: HTMLIFrameElement = doc!.createElement('iframe');

  if (options.width) {
    iframe.setAttribute('width', options.width);
  }
  if (options.height) {
    iframe.setAttribute('height', options.height);
  }
  iframe.setAttribute('allow', stringIfArray(options.featurePolicy, '; '));
  iframe.setAttribute('loading', 'eager');
  if (options.className) {
    iframe.className = options.className;
  }
  if (options.styles) {
    iframe.style.cssText = stringIfArray(options.styles, '; ');
  }
  if (options.sandbox) {
    iframe.setAttribute('sandbox', stringIfArray(options.sandbox, ' '));
  }
  iframe.src = options.src;

  parent.prepend(iframe);

  return iframe;
}

function stringIfArray(
  input: string[] | string | undefined,
  joiner: string
): string {
  if (!input) {
    return '';
  }
  if (Array.isArray(input)) {
    return input.join(joiner);
  }
  return input;
}
