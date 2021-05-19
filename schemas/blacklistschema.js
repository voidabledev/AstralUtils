const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    require: true,
  },
  reason: {
    type: String,
    requred: true,
  },
  expires: Number,
});

module.exports = mongoose.model("blacklist", blacklistSchema);
