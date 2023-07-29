const HotelModal = require("../models/Hotels");
const RoomModal = require("../models/Rooms");
const TransactionModal = require("../models/Transactions");
const { formatDate } = require("../utils/formatDate");

module.exports.createtransaction = async (req, res) => {
  const { hotelId, roomsSelected, dateStart, dateEnd, price, payment } =
    req.body;

  const username = req.user._id;

  const roomIds = roomsSelected.map((item) => item.id);

  try {
    const hotel = await HotelModal.findById(hotelId);
    if (!hotel) {
      return res.status(400).json({ message: "Hotel not found" });
    }

    const rooms = await RoomModal.find({ _id: { $in: roomIds } });

    if (!rooms) {
      return res.status(400).json({ message: "Rooms not found" });
    }

    const roomIdArr = rooms.map((room) => room.id);

    const newTransaction = await TransactionModal.create({
      user: username,
      hotel: hotelId,
      room: roomIdArr,
      dateStart: dateStart,
      dateEnd: dateEnd,
      price: price,
      payment: payment,
      status: "Booked",
    });

    for (const roomSelected of roomsSelected) {
      const room = rooms.find((r) => r._id.toString() === roomSelected.id);
      room.bookings.push({
        transactionId: newTransaction._id,
        roomNumbers: roomSelected.room, // Add the room number from roomsSelected
      });
      await room.save();
    }

    return res.status(200).json({
      success: true,
      message: "creating transaction successfully",
      booking: newTransaction,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error creating transaction: " + err.message });
  }
};

module.exports.getTransaction = async (req, res) => {
  const userId = req.user._id;

  try {
    const transactions = await TransactionModal.find({ user: userId })
      .populate("hotel", "name")
      .populate("room", "bookings");

    if (transactions.length === 0) {
      return res.status(400).json({ message: "No transactions found" });
    }

    const formattedTransactions = transactions.map((transaction) => ({
      _id: transaction._id,
      hotel: transaction.hotel.name,
      room: transaction.room
        .map((room) =>
          room.bookings
            .filter(
              (booking) =>
                booking.transactionId.toString() === transaction._id.toString()
            )
            .map((booked) => booked.roomNumbers)
        )
        .flat(),
      dateStart: formatDate(transaction.dateStart),
      dateEnd: formatDate(transaction.dateEnd),
      price: transaction.price,
      payment: transaction.payment,
      status: transaction.status,
    }));

    return res.status(200).json({
      success: true,
      message: "getting transaction successfully",
      transactions: formattedTransactions,
    });
  } catch (error) {
    return res.status(400).json({ message: "Can't get transaction!" });
  }
};

module.exports.getAllTransaction = async (req, res) => {
  try {
    const transactions = await TransactionModal.find()
      .populate("hotel", "name")
      .populate("room", "bookings")
      .populate("user", "name");

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    const formattedTransactions = transactions.map((transaction) => ({
      _id: transaction?._id,
      user: transaction?.user?.name,
      hotel: transaction?.hotel?.name,
      room: transaction.room
        .map((room) =>
          room.bookings
            .filter(
              (booking) =>
                booking.transactionId.toString() === transaction._id.toString()
            )
            .map((booked) => booked.roomNumbers)
        )
        .flat(),
      dateStart: formatDate(transaction?.dateStart),
      dateEnd: formatDate(transaction?.dateEnd),
      price: transaction?.price,
      payment: transaction?.payment,
      status: transaction?.status,
    }));

    return res.status(200).json({
      success: true,
      message: "getting all transaction successfully",
      transactions: formattedTransactions,
    });
  } catch (error) {
    return res.status(400).json({ message: "Can't get transaction!" });
  }
};
