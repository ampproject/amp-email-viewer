const express = require('express');

const router = express.Router();

router.use(express.json());

router.get('/image-proxy', require('./imageProxy'));
router.get('/bootstrap-page', require('./bootstrapPage'));
router.post('/xhr-proxy', require('./xhrProxy'));
router.post('/mustache-render', require('./mustacheRender'));

module.exports = router;
