const fetch = require('node-fetch');

/**
 * Host of the page that contains the iframe with the bootstrap page.
 *
 * @const {string}
 */
const { HOST_ORIGIN } = process.env;

/**
 * URL query parameter that contains the sender email.
 *
 * @const {string}
 */
const AMP_SOURCE_ORIGIN_PARAMETER = '__amp_source_origin';

/**
 * Allowed HTTP methods that can be proxied.
 *
 * @const {Set<string>}
 */
const ALLOWED_METHODS = new Set([
  'GET',
  'POST',
  'HEAD',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
]);

const JSON_CONTENT_TYPE = 'application/json';
const URLENCODED_CONTENT_TYPE = 'application/x-www-form-urlencoded';

/**
 * Makes an HTTP proxy request and checks if the response follows the email CORS
 * spec.
 *
 * @param {{input: string, init: !Object}} req Request to proxy
 * @param {string} senderEmail Additional parameters for express and parcel
 * @return {!Promise<Object>} Server response
 */
async function requestWithCORS(req, senderEmail) {
  if (!validateRequest(req)) {
    throw new Error('invalid request');
  }
  const url = rewriteURL(req.input, senderEmail);
  const fetched = await fetch(url, fetchParamsFromInit(req.init));
  if (!validateResponse(fetched)) {
    throw new Error('invalid response');
  }
  return fetched.json();
}

function rewriteURL(urlString, sender) {
  const url = new URL(urlString);
  url.searchParams.set(AMP_SOURCE_ORIGIN_PARAMETER, sender);
  return url.href;
}

function fetchParamsFromInit(init) {
  const headers = new fetch.Headers(init.headers);
  headers.set('accept', JSON_CONTENT_TYPE);
  headers.set('content-type', URLENCODED_CONTENT_TYPE);
  headers.set('origin', HOST_ORIGIN);
  return {
    method: init.method,
    body: init.body,
    headers,
    redirect: 'error',
    credentials: 'omit',
    cache: 'no-cache',
  };
}

function validateRequest(request) {
  if (!request) {
    return false;
  }
  let url;
  try {
    url = new URL(request.input);
  } catch (err) {
    return false;
  }
  if (url.protocol !== 'https:') {
    return false;
  }
  if (!ALLOWED_METHODS.has(request.init.method.toUpperCase())) {
    return false;
  }

  return true;
}

function validateResponse(response) {
  const { headers, status } = response;
  if (status !== 200) {
    return false;
  }
  if (!isJSON(headers.get('content-type'))) {
    return false;
  }

  const exposedHeaders = headers
    .get('access-control-expose-headers')
    .split(',')
    .map(header => header.trim().toLowerCase());
  if (!exposedHeaders.includes('amp-access-control-allow-source-origin')) {
    return false;
  }
  if (headers.get('access-control-allow-origin') !== HOST_ORIGIN) {
    return false;
  }

  const url = new URL(response.url);
  const sender = url.searchParams.get(AMP_SOURCE_ORIGIN_PARAMETER);
  const allowedSender = response.headers.get('amp-access-control-allow-source-origin');
  if (sender.toLowerCase() !== allowedSender.toLowerCase()) {
    return false;
  }

  return true;
}

function isJSON(contentType) {
  return contentType.startsWith(JSON_CONTENT_TYPE);
}

module.exports = {
  requestWithCORS,
};
