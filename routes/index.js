const userRouter = require("./user.router");
const hotelRouter = require("./hotel.router");
const transactionRouter = require("./transaction.router");
const roomRouter = require("./room.router");

const routes = (app) => {
  app.use("/api/v1/auth", userRouter);
  app.use("/api/v1/hotel", hotelRouter);
  app.use("/api/v1/transaction", transactionRouter);
  app.use("/api/v1/room", roomRouter);
};

module.exports = routes;
