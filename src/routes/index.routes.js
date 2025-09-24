
const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes.js');
const transactionRoutes = require('./transaction.routes.js');

router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);

module.exports = router;
