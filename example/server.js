require('dotenv').config();
const express = require('express');
const Bundler = require('parcel-bundler');
const modules = require('./server-modules');

/** @const {string} */
const PARCEL_ENTRY_POINT = 'frontend/index.html';

/** @const {Object} */
const DEFAULT_PARCEL_OPTIONS = {
  autoInstall: false,
};

/**
 * Starts the server.
 *
 * @param {number} port Port to listen on
 * @param {Object=} options Additional parameters for express and parcel
 * @return {Promise<http.Server>} Resolves when the server starts
 */
async function start(port, {hostname, parcelOptions = {}} = {}) {
  return new Promise(resolve => {
    const app = express();

    const options = Object.assign({}, DEFAULT_PARCEL_OPTIONS, parcelOptions);
    const bundler = new Bundler(PARCEL_ENTRY_POINT, options);

    app.use('/modules', modules);

    app.use(bundler.middleware());

    const server = app.listen(port, hostname, () => resolve(server));
  });
}

module.exports = {start};
