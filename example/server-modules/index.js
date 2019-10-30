const express = require('express');

const router = express.Router();

router.get('/image-proxy', require('./imageProxy'));

module.exports = router;
