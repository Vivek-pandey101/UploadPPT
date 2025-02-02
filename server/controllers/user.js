const bcrypt = require("bcrypt");
const UserModel = require("../model/User");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ mas: "Email already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashPassword });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        res.send(user);
      } else {
        res.status(401).json({ mas: "Password is wrong" });
      }
    } else {
      res.status(401).json({ msg: "User does not exists" });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const user = (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json("Not Authenticated");
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Fetch all documents or a specific one based on name (if required)
    const users = await UserModel.find();

    if (!users.length) {
      return res
        .status(404)
        .json({ success: false, message: "No User found" });
    }
    res.status(200).json({ success: true, images: users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    });
  }
};

const logout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ err: "Failed to logout..." });
      } else {
        res.status(200).json("Logout Successfull");
      }
    });
  } else {
    res.status(400).json({ err: "No session found" });
  }
};

module.exports = { signup, login, user, logout, getAllUsers };
