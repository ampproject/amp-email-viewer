const express = require('express');
const Bundler = require('parcel-bundler');
const modules = require('./server-modules');

const PARCEL_ENTRY_POINT = 'frontend/index.html';
const DEFAULT_PARCEL_OPTIONS = {
  autoInstall: false,
};

async function start(port, {hostname, parcelOptions = {}} = {}) {
  return new Promise(resolve => {
    const app = express();

    const options = Object.assign({}, DEFAULT_PARCEL_OPTIONS, parcelOptions);
    const bundler = new Bundler(PARCEL_ENTRY_POINT, options);

    app.use('/modules', modules);

    app.use(bundler.middleware());

    app.listen(port, hostname, () => resolve());
  });
}

module.exports = {start};
