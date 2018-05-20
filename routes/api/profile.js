const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load db models
const Profile = require("../../models/Profile");
const User = require("../../models/User");
//@route    GET api/profile/test
//@desc     Test Profile Route
//@access   Public

router.get("/test", (req, res) => res.json({ msg: "Profile Routes" }));

//@route    GET api/profile
//@desc     Get current users profile
//@access   Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    errors.noprofile = "";
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        } else {
          return res.json(profile);
        }
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route    GET api/profile
//@desc     Get current users profile
//@access   Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    // Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
  }
);
module.exports = router;
