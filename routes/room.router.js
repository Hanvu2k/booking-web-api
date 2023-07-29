const express = require("express");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../middleware/auth");
const {
  createRoom,
  getRoom,
  deleteRoom,
  updateRoom,
  getRoombyId,
} = require("../controllers/room.controller");

router.post("/createRoom", verifyToken, verifyAdmin, createRoom);
router.get("/getRoom", verifyToken, verifyAdmin, getRoom);
router.get("/getRoomById", verifyToken, verifyAdmin, getRoombyId);
router.delete("/deleteRoom", verifyToken, verifyAdmin, deleteRoom);
router.patch("/updateRoom", verifyToken, verifyAdmin, updateRoom);

module.exports = router;
