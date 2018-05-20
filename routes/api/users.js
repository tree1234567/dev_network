const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
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
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email }).then(user => {
    if (!user)
      return res
        .status(400)
        .json({ email: "User/Password combination not found" });
    else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch)
          return res
            .status(400)
            .json({ email: "User/Password combination not found" });
        else {
          res.json({ msg: "Success" });
        }
      });
    }
  });
});

module.exports = router;
