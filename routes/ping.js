const express = require('express');
const router = express.Router();

/* GET ping. */
router.get('/', function(req, res, next) {
    return res.json({success: true});
});

module.exports = router;
