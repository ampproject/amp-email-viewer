const express = require('express');

const router = express.Router();

router.use(express.json());

router.get('/image-proxy', handler(require('./imageProxy')));
router.get('/bootstrap-page', handler(require('./bootstrapPage')));
router.get('/link-redirect', handler(require('./linkRedirect')));
router.post('/xhr-proxy', handler(require('./xhrProxy')));
router.post('/mustache-render', handler(require('./mustacheRender')));
router.use('/amp-runtime', handler(require('./ampRuntime')));

function handler(f) {
  return async function(req, res, next) {
    try {
      await f(req, res);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = router;
