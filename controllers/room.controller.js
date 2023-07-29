const HotelModel = require("../models/Hotels");
const RoomModel = require("../models/Rooms");
const TransactionModel = require("../models/Transactions");

module.exports.createRoom = async (req, res) => {
  const { title, price, maxPeople, desc, roomNumbers, hotel } = req.body;

  const roomNumbersArray = roomNumbers.split(",").map(Number);

  try {
    const existHotel = await HotelModel.findOne({ name: hotel });

    if (!existHotel)
      return res
        .status(400)
        .json({ success: false, message: "Hotel's not exist!" });

    const existRoom = await RoomModel.findOne({ title: title });

    if (existRoom)
      return res
        .status(400)
        .json({ success: false, message: "Room's title already exists!" });

    const room = await RoomModel.create({
      title,
      price,
      maxPeople,
      desc,
      roomNumbers: roomNumbersArray,
    });

    existHotel.rooms.push(room._id);
    await existHotel.save();

    return res.status(200).json({
      success: true,
      message: "Create room successfully!",
    });
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
};

module.exports.getRoom = async (_req, res) => {
  try {
    const room = await RoomModel.find();
    return res.status(200).json({
      success: true,
      room: room,
      message: "Get room successfully!",
    });
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
};

module.exports.getRoombyId = async (req, res) => {
  const { roomId } = req.query;

  try {
    const room = await RoomModel.findOne({ _id: roomId });

    if (!room)
      return res
        .status(400)
        .json({ success: false, message: "Can't find room" });

    const formattedRoom = {
      _id: room._id,
      title: room.title,
      price: room.price,
      maxPeople: room.maxPeople,
      roomNumbers: room.roomNumbers,
      desc: room.desc,
    };

    return res.status(200).json({
      success: true,
      room: formattedRoom,
      message: "Get room successfully!",
    });
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
};

module.exports.deleteRoom = async (req, res) => {
  const { roomId } = req.query;

  try {
    const room = await RoomModel.findOne({ _id: roomId });

    if (!room)
      return res
        .status(404)
        .send({ success: false, message: "Room's not exist to delete" });

    const transaction = await TransactionModel.findOne({ room: roomId });

    if (transaction)
      return res
        .status(400)
        .json({
          success: false,
          message: "Can't delete room have transaction",
        });

    const hotel = await HotelModel.findOne({ rooms: room._id });

    if (!hotel)
      return res
        .status(400)
        .send({ success: false, message: "Hotel not found for the room" });

    await RoomModel.deleteOne({ _id: room._id });

    hotel.rooms = hotel.rooms.filter(
      (roomObjectId) => !roomObjectId.equals(room._id)
    );
    await hotel.save();

    return res.status(200).json({
      success: true,
      message: "Deleted room successfully!",
    });
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
};

module.exports.updateRoom = async (req, res) => {
  const { roomId } = req.query;
  const { title, price, maxPeople, desc, roomNumbers, hotel } = req.body;
  const roomNumbersArray = roomNumbers.split(",").map(Number);

  try {
    // new hotel
    const existhotel = await HotelModel.findOne({ name: hotel });

    if (!existhotel) {
      return res
        .status(400)
        .send({ success: false, message: "Hotel not found for the room" });
    }

    const result = await RoomModel.findOneAndUpdate(
      { _id: roomId },
      {
        title,
        price,
        maxPeople,
        desc,
        roomNumbers: roomNumbersArray,
      },
      { new: true }
    );

    existhotel.rooms.push(result._id);
    await existhotel.save();

    if (result)
      return res.status(200).json({
        message: "Update room successfully!",
        rooms: result,
      });

    return res
      .status(400)
      .json({ success: false, message: "Room nof found! " });
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
};
