const express = require("express");
const router = express.Router();
const {
  getHotelByKey,
  getHotelByRating,
  searchHotel,
  getHotelDetail,
  getRoomsByHotel,
  createHotel,
  getHotel,
  deleteHotel,
  updateHotel,
  getHotelbyId,
} = require("../controllers/hotel.controller");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.get("/places", getHotelByKey);
router.get("/rating", getHotelByRating);
router.post("/search", searchHotel);
router.get("/detail", getHotelDetail);
router.get("/rooms", getRoomsByHotel);
router.post("/createHotel", verifyToken, verifyAdmin, createHotel);
router.get("/getHotel", verifyToken, verifyAdmin, getHotel);
router.get("/getHotelById", verifyToken, verifyAdmin, getHotelbyId);
router.delete("/deleteHotel", verifyToken, verifyAdmin, deleteHotel);
router.patch("/updateHotel", verifyToken, verifyAdmin, updateHotel);

module.exports = router;
