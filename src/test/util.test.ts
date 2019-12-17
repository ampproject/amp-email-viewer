import {
  parseHTML,
  serializeHTML,
  isValidURL,
  isValidURLWithPlaceholder,
  rewriteURLUsingPlaceholder,
  postJSON,
} from '../util';

describe('util', () => {
  const html = `<!DOCTYPE html>
<html><head>
<script src="something.js"></script>
</head>
<body data-test="foo">
<img src="something.jpg">

</body></html>`;

  test('parseHTML returns DOM', () => {
    const parsed = parseHTML(html);
    const body = parsed.querySelector('body');
    expect(body).toBeTruthy();
    expect(body!.getAttribute('data-test')).toBe('foo');
  });

  test('serializeHTML serializes output from parseHTML', () => {
    const serialized = serializeHTML(parseHTML(html));
    expect(serialized).toBe(html);
  });

  test('isValidURL', () => {
    expect(isValidURL('foo')).toBe(false);
    expect(isValidURL('https://example.com/hello')).toBe(true);
    expect(isValidURL('http://example.com/hello')).toBe(false);
    expect(isValidURL('http://localhost:8080/hello')).toBe(true);
    expect(isValidURL('https://10.0.0.1:8080/hello')).toBe(true);
  });

  test('isValidURLWithPlaceholder', () => {
    expect(isValidURLWithPlaceholder('foo')).toBe(false);
    expect(isValidURLWithPlaceholder('https://example.com/hello')).toBe(false);
    expect(
      isValidURLWithPlaceholder('https://example.com/hello?param=%s')
    ).toBe(true);
    expect(isValidURLWithPlaceholder('https://example.com/%s')).toBe(true);
    expect(isValidURL('http://example.com/hello')).toBe(false);
    expect(isValidURL('http://localhost:8080/hello')).toBe(true);
    expect(isValidURL('https://10.0.0.1:8080/hello')).toBe(true);
  });

  test('rewriteURLUsingPlaceholder', () => {
    expect(
      rewriteURLUsingPlaceholder(
        'https://proxyme.example/',
        'https://example.com/%s'
      )
    ).toBe('https://example.com/https%3A%2F%2Fproxyme.example%2F');
    expect(
      rewriteURLUsingPlaceholder(
        'http://proxyme.example/',
        'https://example.com/%s'
      )
    ).toBe('');
    expect(() =>
      rewriteURLUsingPlaceholder(
        'https://proxyme.example/',
        'https://example.com/'
      )
    ).toThrow();
  });

  test('postJSON', async () => {
    const mockFn = jest.fn().mockReturnValue({ json: async () => ({}) });
    // tslint:disable:no-any
    (window.fetch as any) = mockFn;
    await postJSON('https://example.com/', {});
    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockFn.mock.calls[0][0]).toBe('https://example.com/');
    expect(mockFn.mock.calls[0][1]).toEqual(
      expect.objectContaining({ body: '{}' })
    );
  });
});
