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
  const {pathname} = url.parse(req.originalUrl);
  const match = pathname.match(/(v0|ww).*\.js$/);
  const file = match ? path.join(RUNTIME_DIST, match[0]) : null;
  if (!file || !fs.existsSync(file)) {
    res.status(404);
    throw new Error('file not found');
  }
  res.type('text/javascript');
  res.setHeader('access-control-allow-origin', '*');
  res.sendFile(file, { root: '.' });
};
