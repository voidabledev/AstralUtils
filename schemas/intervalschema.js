const mongoose = require("mongoose");

const intervalSchema = mongoose.Schema({
  channelId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  interval: {
    type: Number,
    required: true,
  },
  expires: {
    type: Number,
    required: true,
  },
  executed: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("interval", intervalSchema);
