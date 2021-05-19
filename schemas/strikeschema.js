const mongoose = require("mongoose");

const strikeSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  strikeId: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("strike", strikeSchema);
