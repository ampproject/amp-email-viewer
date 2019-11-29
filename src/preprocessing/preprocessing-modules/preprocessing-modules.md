# Preprocessing modules

These modules are responsible for processing and validating the AMP code before
it's displayed inside the viewer.

## Validator module

This module runs the [AMP validator](https://www.npmjs.com/package/amphtml-validator)
on the AMP code to ensure it's compliant with the requirements for the
`AMP4EMAIL` format.

It doesn't modify the AMP code and throws an exception when the AMP is invalid.

## HTML tag module

This module adds the following attributes to the AMP document's `<html>` tag:

-   `allow-xhr-interception`
-   `allow-viewer-render-template`
-   `report-errors-to-viewer`

These are used to enable capabilities for the AMP viewer.

## Hyperlink rewrite

Rewrites all hyperlinks (`<a>` tags) to include the following attributes:

-   `target="_blank"` to ensure the link opens in a new tab.
-   `rel="noreferrer noopener"` to prevent setting the `Referer` HTTP header and
    ensure new window can't access `window.opener`.

If `linkRedirectURL` is set in the global config, the `href` attribute is
rewritten to use the redirect URL instead of the original.
