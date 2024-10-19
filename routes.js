const express = require('express');
const { createRule, combineRules, evaluateRule,getAllRules } = require('./controller');
const router = express.Router();

router.post('/create', createRule);
router.post('/combine', combineRules);
router.post('/evaluate', evaluateRule);
router.get('/rules', getAllRules);

module.exports = router;
