const express = require("express");
const { signup, login, user, logout, getAllUsers } = require("../controllers/user");

const router = express.Router();

router
  .post("/signup", signup )
  .post("/login", login)
  .get("/getAllUsers", getAllUsers)
  .post("/logout", logout);

module.exports = router;
