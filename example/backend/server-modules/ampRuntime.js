const fs = require('fs');
const path = require('path');
const url = require('url');
const express = require('express');

const RUNTIME_DIST = 'ampruntime/dist';

module.exports = (req, res) => {
  if (!fs.existsSync(RUNTIME_DIST)) {
    res.status(404);
    throw new Error('AMP runtime not built');
  }
  const file = parsePath(req.originalUrl);
  if (!file || !fs.existsSync(file)) {
    res.status(404);
    throw new Error('file not found');
  }
  res.type('text/javascript');
  res.setHeader('access-control-allow-origin', '*');
  res.sendFile(file, { root: '.' });
};

function parsePath(inputUrl) {
  const {pathname} = url.parse(inputUrl);
  const match = pathname.match(/(v0|ww).*\.js$/);
  if (!match) {
    return null;
  }
  const segment = path.normalize(match[0]);
  if (segment.startsWith('.')) {
    return null;
  }
  return path.join(RUNTIME_DIST, segment);
}
