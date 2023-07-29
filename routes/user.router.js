const express = require("express");
const router = express.Router();
const {
  register,
  registerAdmin,
  login,
  getUser,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth");

router.post("/register", register);
router.post("/registerAdmin", registerAdmin);
router.post("/login", login);
router.get("/user", verifyToken, getUser);

module.exports = router;
