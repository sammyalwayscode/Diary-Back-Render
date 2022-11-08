const mongoose = require("mongoose");
const diarySchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    message: {
      type: String,
    },

    image: {
      type: String,
    },

    imageID: {
      type: String,
    },

    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);

const diaryModel = mongoose.model("diaries", diarySchema);
module.exports = diaryModel;
