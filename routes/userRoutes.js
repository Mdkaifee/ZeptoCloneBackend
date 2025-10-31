const express = require('express');
const { editProfile, softDeleteAccount } = require('../controllers/userController');
const router = express.Router();

// Ensure the route parameter name matches what you use in the controller
router.patch('/edit/:id', editProfile);
router.delete('/soft-delete/:id', softDeleteAccount);

module.exports = router;
