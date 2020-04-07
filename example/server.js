require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});
const express = require('express');
const Bundler = require('parcel-bundler');
const modules = require('./backend/server-modules');

/** @const {Array<string>} */
const PARCEL_ENTRY_POINTS = [
  'frontend/tester/index.html',
  'frontend/demo/index.html',
];

/** @const {Object} */
const PARCEL_DEFAULT_OPTIONS = {
  autoInstall: false,
};

/**
 * Starts the server.
 *
 * @param {number} port Port to listen on
 * @param {Object=} options Additional parameters for express and parcel
 * @return {!Promise<http.Server>} Resolves when the server starts
 */
async function start(port, { hostname, parcelOptions = {} } = {}) {
  return new Promise((resolve) => {
    const app = express();

    const options = Object.assign({}, PARCEL_DEFAULT_OPTIONS, parcelOptions);

    app.use('/modules', modules);

    app.use(new Bundler(PARCEL_ENTRY_POINTS, options).middleware());

    const server = app.listen(port, hostname, () => resolve(server));
  });
}

module.exports = { start };
