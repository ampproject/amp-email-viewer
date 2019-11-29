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

## AMP runtime URL rewrite

Rewrites external scripts referencing the AMP runtime hosted on
`cdn.ampproject.org` to use a different CDN or pin the runtime version,
depending on the global config.

## Hyperlink rewrite

Rewrites all hyperlinks (`<a>` tags) to include the following attributes:

-   `target="_blank"` to ensure the link opens in a new tab.
-   `rel="noreferrer noopener"` to prevent setting the `Referer` HTTP header and
    ensure new window can't access `window.opener`.

If `linkRedirectURL` is set in the global config, the `href` attribute is
rewritten to use the redirect URL instead of the original.

## Head tag injections

This module adds the following `<meta>` tags into `<head>`:

-   `<meta name="amp-allowed-url-macros">` which determines which
    [AMP variable substitutions](https://github.com/ampproject/amphtml/blob/master/spec/amp-var-substitutions.md)
    are allowed. Currently, no AMP variable substitutions are supported in AMP
    for Email.

-   `<meta name="amp-action-whitelist">` which determines which
    [AMP actions](https://amp.dev/documentation/guides-and-tutorials/learn/amp-actions-and-events/)
    are allowed. Currently, the following actions are allowed in AMP for Email:
    -   `*.show`
    -   `*.hide`
    -   `*.toggleVisibility`
    -   `*.toggleClass`
    -   `*.scrollTo`
    -   `*.focus`
    -   `AMP-CAROUSEL.goToSlide`
    -   `AMP-IMAGE-LIGHTBOX.open`
    -   `AMP-LIGHTBOX.open`
    -   `AMP-LIGHTBOX.close`
    -   `AMP-LIST.changeToLayoutContainer`
    -   `AMP-LIST.refresh`
    -   `AMP-SELECTOR.clear`
    -   `AMP-SELECTOR.selectUp`
    -   `AMP-SELECTOR.selectDown`
    -   `AMP-SELECTOR.toggle`
    -   `AMP-SIDEBAR.open`
    -   `AMP-SIDEBAR.close`
    -   `AMP-SIDEBAR.toggle`
    -   `FORM.clear`
    -   `FORM.submit`
    -   `AMP.setState`

In addition, it adds the following `<script>` tag to enable AMP viewer
integration:

```html
<script async src="https://cdn.ampproject.org/v0/amp-viewer-integration-0.1.js">
```

## Size check module

This module checks if the total size of the AMP code (in bytes) is within limits
defined inside the global config, if set.

## Element limits module

This module ensures the number of AMP elements used inside the email is within
the limits defined in the standard, per https://github.com/ampproject/wg-amp4email/issues/4

## Browser detection module

This module checks if the current browser version is recent enough to support
important web features required to safely render AMP emails. Because CSP support
can't be detected using normal feature detection, this module relies on the user
agent to determine if these features are supported.

## Image URL rewrite

Rewrites all image URLs (`amp-img` and `amp-anim` tags) with URLs of the image
proxy.

Only active when `imageProxyURL` is set in the global config.
