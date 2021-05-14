const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    requred: true,
  },
});

module.exports = mongoose.model("blacklist", blacklistSchema);
