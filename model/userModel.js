const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },

    password: {
      type: String,
    },

    avatar: {
      type: String,
    },
    avatarID: {
      type: String,
    },

    diary: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "diaries",
      },
    ],
  },
  { timestamps: true }
);

const usersModel = mongoose.model("users", userSchema);
module.exports = usersModel;
