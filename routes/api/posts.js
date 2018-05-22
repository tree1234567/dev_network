const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Mongoose models
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

//Validation
const validPostInput = require("../../validation/post");

//@route    GET api/posts/test
//@desc     Test Post Route
//@access   Public
router.get("/test", (req, res) => res.json({ msg: "Posts Routes" }));

//@route    Get api/posts
//@desc     Get Post
//@access   Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ nopostsfound: "No posts foud under that Id" })
    );
});

//@route    Get api/posts
//@desc     Get Post by Id
//@access   Public
router.get("/:post_id", (req, res) => {
  Post.findById(req.params.post_id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found under that Id" })
    );
});

//@route    DELETE api/posts/:id
//@desc     Get Post by Id
//@access   Private
router.delete(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.post_id).then(post => {
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }

        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch(err =>
            res
              .status(404)
              .json({ postnotfound: "post with this Id was not found" })
          );
      });
    });
  }
);

//@route    Post api/posts/like
//@desc     Add a like on a Post
//@access   Private
router.post(
  "/like/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: "user already liked this post" });
        }
        console.log("before");
        post.likes.push({ user: req.user.id });
        console.log("after");

        post
          .save()
          .then(post => res.json(post))
          .catch(err =>
            res
              .status(401)
              .json({ saveError: "save was unable to be done at this time" })
          );
      })
      .catch(err =>
        res.status(404).json({ postnotfound: "post not found with that Id" })
      );
  }
);

//@route    Post api/posts
//@desc     Create Post
//@access   Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validPostInput(req.body);

    if (!isValid) return res.status(400).json(errors);

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost
      .save()
      .then(post => res.json(post))
      .catch(err => res.status(400).json(err));
  }
);

module.exports = router;
