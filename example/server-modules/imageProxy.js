const fetch = require('node-fetch');

const MAX_IMAGE_SIZE = 1024 * 1024;

module.exports = async function(req, res) {
  const url = req.query.url || '';
  if (!url.startsWith('http')) {
    throw new Error('invalid url');
  }
  const fetched = await fetch(url, {
    size: MAX_IMAGE_SIZE,
  });
  if (fetched.status !== 200) {
    throw new Error('request failed');
  }
  const type = fetched.headers.get('Content-Type');
  if (!isValidImage(type)) {
    throw new Error('not an image');
  }
  const data = Buffer.from(await fetched.arrayBuffer());
  res.type(type);
  res.send(data);
};

function isValidImage(contentType) {
  return contentType.startsWith('image/');
}
