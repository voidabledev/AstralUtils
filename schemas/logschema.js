const mongoose = require("mongoose");

const logSchema = mongoose.Schema({
  channelId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  _type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("log-channels", logSchema);
