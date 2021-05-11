const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const punishSchema = mongoose.Schema(
  {
    _type: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    guildId: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("timed-punish", punishSchema);
