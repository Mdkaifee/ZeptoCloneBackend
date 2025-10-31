const express = require('express');
const {
  getPrivacyPolicy,
  updatePrivacyPolicy,
  getTermsAndConditions,
  updateTermsAndConditions
} = require('../controllers/contentController');

const router = express.Router();

router.get('/privacy-policy', getPrivacyPolicy);
router.put('/privacy-policy', updatePrivacyPolicy);
router.get('/terms-and-conditions', getTermsAndConditions);
router.put('/terms-and-conditions', updateTermsAndConditions);

module.exports = router;
