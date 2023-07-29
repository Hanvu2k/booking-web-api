const UserModel = require("../models/Users");

module.exports.verifyToken = async (req, res, next) => {
  const { token } = req.query;

  const [email, password] = token.split(" ");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await UserModel.findOne({ email: email, password: password });

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = user;
  next();
};

module.exports.verifyAdmin = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.isAdmin) next();
    else return res.status(401).json({ message: "No Permission!" });
  } catch (error) {
    return res.error(error.message, 500);
  }
};
