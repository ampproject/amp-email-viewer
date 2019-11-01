const express = require('express');

const router = express.Router();

router.get('/image-proxy', require('./imageProxy'));
router.get('/bootstrap-page', require('./bootstrapPage'));

module.exports = router;
