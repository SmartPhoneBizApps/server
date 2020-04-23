const express = require('express');
const { adaptiveCard_card } = require('../../controllers/cards/cards');

const router = express.Router({ mergeParams: true });

router.route('/').get(adaptiveCard_card);
module.exports = router;
