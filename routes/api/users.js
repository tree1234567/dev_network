const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys").secretOrKey;
const passport = require("passport");

//Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");

//@route    GET api/users/test
//@desc     Test Users Route
//@access   Public
router.get("/test", (req, res) => res.json({ msg: "Users Routes" }));

//@route    Post api/users/register
//@desc     Register Users
//@access   Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        rating: "r",
        d: "mm"
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      console.log(typeof newUser);
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route    Post api/users/login
//@desc     Login Users
//@access   Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) return res.status(400).json(errors);

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email }).then(user => {
    if (!user)
      return res
        .status(400)
        .json({ errors: { email: "User/Password combination not found" } });
    else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch)
          return res
            .status(400)
            .json({ errors: { email: "User/Password combination not found" } });
        else {
          //User matched

          const payload = {
            // Create Jwt payload
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };
          jwt.sign(payload, keys, { expiresIn: 3600 }, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          });
        }
      });
    }
  });
});

//@route    Post api/users/current
//@desc     Return current user
//@access   Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
