# Rendering modules

These modules are active after the viewer iframe is rendered and the AMP page
appears. They are responsible for reacting to requests made by the AMP document.

## `iframe` Height module

This module reacts to changes to the AMP document's height and resizes the
viewer `iframe` to adjust to them. It listens to `documentHeight` messages.

## XHR proxy module

This module reacts to attempts from the AMP document to make XHR requests. These
requests are created by components such as `amp-form` and `amp-list`. It listens
to `xhr` messages.
