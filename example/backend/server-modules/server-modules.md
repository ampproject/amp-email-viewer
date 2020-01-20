# Server-side modules

These modules are components an email client implementing an AMP viewer is
expected to have on their server.

## Bootstrap page

**Requirement level: *REQUIRED***

This module serves a static HTML page that has a strong CSP and contains the
"bootstrap" code which waits for the parent page to inject AMP code into it.


### Content Security Policy

The following `Content-Security-Policy` header is recommended:

```text
default-src 'none';
script-src 'hash of bootstrap page JS' https://cdn.ampproject.org;
style-src 'unsafe-inline';
img-src data: https://*.image-proxy-host.example;
frame-src 'none'data:;
connect-src https://cdn.ampproject.org/rtv/;
sandbox allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts;
base-uri 'none';
child-src blob:;
form-action 'none';
frame-ancestors https://host.example;
block-all-mixed-content;
worker-src blob:
```

Where the following need to be replaced:

-   `hash of bootstrap page JS` is replaced with the hash of the script inlined
    in the bootstrap page.
-   `https://*.image-proxy-host.example` is replaced with the origin that hosts
    the *Image proxy* module.
-   `https://host.example` is replaced with the origin of the email client.

## Image proxy

**Requirement level: *RECOMMENDED***

The image proxy module proxies images in order to preserve user privacy. Given
an image URL, it downloads (and optionally caches) the image and then serves it
to the client.

## XHR proxy

**Requirement level: *RECOMMENDED***

This module proxies XHR requests intercepted by the AMP viewer that are created
by components like `amp-form` and `amp-list`.

It accepts an object created by the XHR proxy rendering module.
