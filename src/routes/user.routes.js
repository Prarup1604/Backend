
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', userController.getUsers);

module.exports = router;
