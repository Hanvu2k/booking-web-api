const UserModel = require("../models/Users");

module.exports.register = async (req, res) => {
  try {
    const { name, password, fullName, phoneNumber, email } = req.body;

    const userNameCheck = await UserModel.findOne({ name });
    if (userNameCheck)
      return res.status(400).json({ message: "User's name in used" });
    const emailCheck = await UserModel.findOne({ email });
    if (emailCheck)
      return res.status(400).json({ message: "User's email in used" });

    const user = await UserModel.create({
      name: name,
      password: password,
      fullName: fullName,
      phoneNumber: phoneNumber,
      email: email,
      isAdmin: false,
    });

    const userJson = user.toAuthJSON();

    return res.status(200).json({
      message: "Register successed!!",
      user: userJson,
    });
  } catch (error) {
    return res.status(400).josn({ message: error.message });
  }
};

module.exports.registerAdmin = async (req, res) => {
  try {
    const { name, password, fullName, phoneNumber, email } = req.body;

    const userNameCheck = await UserModel.findOne({ name });
    if (userNameCheck)
      return res.status(400).json({ message: "User's name in used" });
    const emailCheck = await UserModel.findOne({ email });
    if (emailCheck)
      return res.status(400).json({ message: "User's email in used" });

    const user = await UserModel.create({
      name: name,
      password: password,
      fullName: fullName,
      phoneNumber: phoneNumber,
      email: email,
      isAdmin: true,
    });

    const userJson = user.toAuthJSON();

    return res.status(200).json({
      message: "Register successed!!",
      user: userJson,
    });
  } catch (error) {
    return res.status(400).josn({ message: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email, password: password });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Wrong email or password!" });

    const userJson = user.toAuthJSON();

    return res.status(200).json({
      success: true,
      message: "Login successed!!",
      user: userJson,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) return res.status(400).json({ message: "Invalid token!" });

    const userJson = user.toAuthJSON();

    return res.status(200).json({
      success: true,
      message: "Get user success!",
      user: userJson,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
