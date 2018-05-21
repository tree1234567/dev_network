const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
    // required: true
  },
  avatar: {
    type: String
    // required: true
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      avatar: {
        type: String
        // required: true
      },
      date: {
        type: Date,
        default: Date.now,
        required: true
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = Post = mongoose.model("post", PostSchema);
