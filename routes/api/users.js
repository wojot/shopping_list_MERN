const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = mongoose.model("User", require("../../models/User.js"));
const config = require("../../config/default.json");
const saltRounds = parseInt(config.saltRounds);
const authMiddleware = require('../../middleware/authMiddleware');
var jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  User.find((err, user) => {
    if (err) res.status(500).send({ msg: "Error when retrieving Users!" });
    res.json(user);
  });
}); 

router.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send({ msg: "Please submit complete data!" });

  User.countDocuments({ email }, (err, count) => {
    if (err) res.status(500).send({ msg: "Error when adding new User!" });
    if (count > 0) {
      res.status(400).send({ msg: "Email already has been taken!" });
    } else {
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
          let newUser = new User({ email, password: hash });
          newUser.save((err, newUser) => {
            if (err) res.status(500).send({ msg: "Error when adding new User!" });
            const token = jwt.sign({ id: newUser._id }, config.secretJWT, { expiresIn: "1h" });
            res.status(200).json({
              msg: `User ${newUser.email} registered succcessfully!`,
              token,
              registeredUser: {
                id: newUser._id,
                email: newUser.email,
                added: newUser.added
              }
            });
          });
        });
      });
    }
  });
});

router.get('/details', authMiddleware, (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err) res.status(500).send({
      msg: "Error when loading user!"
    });
    res.json(user)
  })
})

module.exports = router;
