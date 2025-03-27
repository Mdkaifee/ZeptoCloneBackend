const express = require('express');
const { editProfile } = require('../controllers/userController');
const router = express.Router();

// Ensure the route parameter name matches what you use in the controller
router.patch('/edit/:id', editProfile);

module.exports = router;
