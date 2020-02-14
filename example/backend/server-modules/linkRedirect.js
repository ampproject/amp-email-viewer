const HOSTNAME_BLACKLIST = new Set([
  'evil.example'
]);

module.exports = function(req, res) {
  const url = new URL(req.query.url || '');
  if (HOSTNAME_BLACKLIST.has(url.hostname)) {
    res.type('text/html');
    let payload = 'The email contained a link to a potentially dangerous website.<br>';
    payload += `<a href="${url}" rel="noreferrer noopener">Visit anyway</a>`;
    res.send(payload);
    return;
  }
  res.redirect(url.href, 302);
};
