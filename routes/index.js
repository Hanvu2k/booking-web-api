const route = (app) => {
  app.use("/", (req, res, next) => {
    res.send("Hello World!");
  });
};

module.exports = route;
