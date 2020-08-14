const router = require("express").Router();

const Helper = require("../Helper");
const User = require("../models/User");

router.post("/signin", (req, res) => {
  const { username, password } = req.body;
  const user = User.findOne({ username, password });

  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const accessToken = Helper.generateAccessToken(user);
  const refreshToken = Helper.generateAccessToken(user);

  req.session.refreshToken = refreshToken;

  return res.status(200).json({ accessToken });
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const user = User.findOne({ username });

  if (user) {
    return res.status(400).json({
      message: "User with username '" + username + "' already exists.",
    });
  }

  try {
    User.create({ username, password });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error while creating new user!" });
  }

  const accessToken = Helper.generateAccessToken(user);
  const refreshToken = Helper.generateAccessToken(user);

  req.session.refreshToken = refreshToken;

  return res.status(200).json({ accessToken });
});

router.delete("/signout", (req, res) => {
  return req.session.destroy((err) => {
    return res.sendStatus(200);
  });
});

module.exports = router;
