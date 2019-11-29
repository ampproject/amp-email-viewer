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
