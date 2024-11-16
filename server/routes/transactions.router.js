const express = require('express');

const authorize = require('../middlewares/authorize');
const { createTransaction, updateTransactionStatus, getTransactions, getTransaction } = require('../controllers/transactions.controller');

const router = express.Router();

router.post("/", authorize, createTransaction)

router.patch("/:transaction_id/status", authorize, updateTransactionStatus)

router.get('/', authorize, getTransactions)

router.get('/:transaction_id', authorize, getTransaction)

module.exports = router;