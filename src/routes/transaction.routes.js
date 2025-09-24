
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller.js');

router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);

module.exports = router;
