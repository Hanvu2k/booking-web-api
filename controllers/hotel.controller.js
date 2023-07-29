const HotelModal = require("../models/Hotels");
const RoomModal = require("../models/Rooms");
const TransactionModal = require("../models/Transactions");

// get hotels by key (city, type)
module.exports.getHotelByKey = async (req, res) => {
  try {
    const { key = "city" } = req.query;
    const data = await HotelModal.aggregate([
      {
        $group: {
          _id: `$${key}`,
          count: { $sum: 1 },
          name: { $first: "$name" },
          photos: { $first: "$photos" },
          type: { $first: "$type" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      hotels: data,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get hotels by rating
module.exports.getHotelByRating = async (req, res) => {
  try {
    const hotels = await HotelModal.find().sort({ rating: -1 }).limit(3);

    return res.status(200).json({
      success: true,
      hotels: hotels,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// search hotels with  city, date, peoples, room number
module.exports.searchHotel = async (req, res) => {
  const { city, maxPeople, roomNumbers, date } = req.body;

  const [dateStart, dateEnd] = date;

  try {
    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);

    const hotels = await HotelModal.aggregate([
      {
        $match: {
          city: city,
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "rooms",
          foreignField: "_id",
          as: "matchedRooms",
        },
      },
      {
        $unwind: "$matchedRooms",
      },
      {
        $match: {
          "matchedRooms.maxPeople": { $gte: maxPeople },
          "matchedRooms.roomNumbers": { $size: roomNumbers },
        },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "matchedRooms._id",
          foreignField: "room",
          as: "occupiedRooms",
        },
      },
      {
        $match: {
          $and: [
            { "occupiedRooms.dateStart": { $not: { $gt: startDate } } },
            { "occupiedRooms.dateEnd": { $not: { $gt: endDate } } },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          address: { $first: "$address" },
          distance: { $first: "$distance" },
          city: { $first: "$city" },
          photos: { $first: "$photos" },
          cheapestPrice: { $first: "$matchedRooms.price" },
          desc: { $first: "$desc" },
          type: { $first: "$type" },
          rating: { $first: "$rating" },
          rooms: { $addToSet: "$matchedRooms" },
        },
      },
    ]);

    if (hotels.length <= 0) {
      return res.status(200).json({
        success: false,
        message: "Không có khách sạn nào phù hợp",
      });
    }

    return res.status(200).json({
      success: true,
      data: hotels,
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// get detail info hotel
module.exports.getHotelDetail = async (req, res) => {
  try {
    const { id } = req.query;

    const hotel = await HotelModal.findById(id).populate("rooms", "price");

    const cheapestPrice = hotel.rooms.reduce(
      (min, obj) => Math.min(min, obj.price),
      hotel.rooms[0].price
    );

    return res.status(200).json({
      success: true,
      data: {
        _id: hotel._id,
        name: hotel.name,
        type: hotel.type,
        city: hotel.city,
        address: hotel.address,
        title: hotel.name,
        desc: hotel.desc,
        photos: hotel.photos,
        distance: hotel.distance,
        featured: hotel.featured,
        cheapestPrice: cheapestPrice,
      },
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// get rooms hotel
module.exports.getRoomsByHotel = async (req, res) => {
  try {
    const { id: hotelId, date } = req.query;
    const [dateStart, dateEnd] = date.split(" to ");

    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);

    // Tìm khách sạn theo _id
    const hotel = await HotelModal.findById(hotelId).exec();
    if (!hotel) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy khách sạn với _id đã cho." });
    }

    // Lấy danh sách các phòng của khách sạn
    const rooms = await RoomModal.find({ _id: { $in: hotel.rooms } }).exec();

    // Lọc các phòng đã được đặt trong khoảng thời gian startDate và endDate
    const occupiedRooms = await TransactionModal.find({
      hotel: hotelId,
      dateStart: { $lte: endDate },
      dateEnd: { $gte: startDate },
    }).distinct("room");

    // Lọc các phòng không bị trùng lặp
    const availableRooms = rooms.filter(
      (room) => !occupiedRooms.includes(room._id)
    );

    return res.status(200).json({
      success: true,
      data: availableRooms,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// CRUD hotels

module.exports.createHotel = async (req, res) => {
  const { name, type, city, address, distance, featured, photos, desc, rooms } =
    req.body;
  const roomTitlesArray = rooms.split(",").map((roomTitle) => roomTitle.trim());

  try {
    const existHotel = await HotelModal.findOne({
      name: name,
      address: address,
    });

    if (existHotel)
      return res.status(400).json({
        success: false,
        message: "Hotel's name and address is existed !",
      });

    const foundRooms = await RoomModal.find({
      title: { $in: roomTitlesArray },
    });

    if (foundRooms.length !== roomTitlesArray.length) {
      const foundRoomTitles = foundRooms.map((room) => room.title);
      const missingRooms = roomTitlesArray.filter(
        (roomTitle) => !foundRoomTitles.includes(roomTitle)
      );
      return res.status(400).json({
        success: false,
        message: `The following room(s) do not exist: ${missingRooms.join(
          ", "
        )}`,
      });
    }

    const roomIds = foundRooms.map((room) => room._id);

    const newHotel = await HotelModal.create({
      name,
      type,
      city,
      address,
      distance,
      photos,
      desc,
      rating: Math.floor(Math.random() * 4 + 1),
      featured,
      rooms: roomIds,
    });

    return res.status(200).json({
      success: true,
      hotel: newHotel,
      message: "Create hotel successfully!",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.getHotel = async (_req, res) => {
  try {
    const hotels = await HotelModal.find();

    return res.status(200).json({
      success: true,
      hotel: hotels,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.getHotelbyId = async (req, res) => {
  try {
    const { hotelId } = req.query;

    const hotel = await HotelModal.findOne({ _id: hotelId }).populate("rooms");

    if (!hotel)
      return res
        .status(400)
        .json({ success: false, message: "Can't get hotel" });

    if (hotel.rooms.length === 0) {
      const rooms = await RoomModal.find();

      return res.status(200).json({
        success: true,
        message: "Get hotel successfully",
        hotel: {
          _id: hotel._id,
          name: hotel.name,
          type: hotel.type,
          city: hotel.city,
          address: hotel.address,
          title: hotel.name,
          desc: hotel.desc,
          photos: hotel.photos,
          distance: hotel.distance,
          featured: hotel.featured,
          price: rooms.flatMap((room) => room.price),
          rooms: rooms.flatMap((room) => room.title),
        },
      });
    }

    const formatDataHotel = {
      _id: hotel._id,
      name: hotel.name,
      type: hotel.type,
      city: hotel.city,
      address: hotel.address,
      title: hotel.name,
      desc: hotel.desc,
      photos: hotel.photos,
      distance: hotel.distance,
      featured: hotel.featured,
      price: hotel.rooms
        .flatMap((room) => room.price)
        .reduce((min, current) => {
          return current < min ? current : min;
        }),
      rooms: hotel.rooms.flatMap((room) => room.title),
    };

    return res.status(200).json({
      success: true,
      message: "Get hotel successfully",
      hotel: formatDataHotel,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.deleteHotel = async (req, res) => {
  try {
    const { hotelId } = req.query;

    const hotels = await HotelModal.findOne({ _id: hotelId });

    if (!hotels)
      return res.status(400).json({ message: "Hotel's not exist to deleted." });

    const isTransaction = await TransactionModal.findOne({ hotel: hotelId });

    if (isTransaction)
      return res
        .status(400)
        .json({ message: "Can't delete hotel have transaction" });

    await HotelModal.deleteOne({ _id: hotelId });

    return res.status(200).json({
      success: true,
      message: "Deleted hotel successfully!",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.updateHotel = async (req, res) => {
  try {
    const { hotelId } = req.query;

    const { name, type, city, address, distance, photos, desc, rating, rooms } =
      req.body;

    const roomTitlesArray = rooms
      .split(",")
      .map((roomTitle) => roomTitle.trim());

    const foundRooms = await RoomModal.find({
      title: { $in: roomTitlesArray },
    });

    if (foundRooms.length !== roomTitlesArray.length) {
      const foundRoomTitles = foundRooms.map((room) => room.title);
      const missingRooms = roomTitlesArray.filter(
        (roomTitle) => !foundRoomTitles.includes(roomTitle)
      );
      return res.status(400).json({
        success: false,
        message: `The following room(s) do not exist: ${missingRooms.join(
          ", "
        )}`,
      });
    }

    const roomIds = foundRooms.map((room) => room._id);

    const result = await HotelModal.findOneAndUpdate(
      { _id: hotelId },
      {
        name,
        type,
        city,
        address,
        distance,
        photos,
        desc,
        rating,
        rooms: roomIds,
      },
      { new: true }
    );

    if (result)
      return res.status(200).json({
        message: "Update hotel successfully!",
        hotels: result,
      });

    return res
      .status(400)
      .json({ success: false, message: "Hotel not found!!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
