const express = require('express');
const { getProverbs, seedProverbs } = require('../controllers/proverbController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/', authenticate, getProverbs);
router.post('/seed', seedProverbs);

module.exports = router;
