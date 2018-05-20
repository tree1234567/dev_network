const express = require("express");
const router = express.Router();

//@route    GET api/users/test
//@desc     Test Users Route
//@access   Public
router.get("/test", (req, res) => res.json({ msg: "Users Routes" }));

module.exports = router;
