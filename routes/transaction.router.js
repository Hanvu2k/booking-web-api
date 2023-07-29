const express = require("express");
const router = express.Router();
const {
  createtransaction,
  getTransaction,
  getAllTransaction,
} = require("../controllers/transaction.controller");

const { verifyToken } = require("../middleware/auth");

router.post("/booking", verifyToken, createtransaction);
router.get("/getBooking", verifyToken, getTransaction);
router.get("/getAllTransaction", verifyToken, getAllTransaction);

module.exports = router;
