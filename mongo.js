const mongoose = require("mongoose");
const mongoPath =
  "mongodb+srv://aurora:Sjfwse8Qbw1tYH9E@aurora.k0if4.mongodb.net/aurora?retryWrites=true&w=majority";

module.exports = async () => {
  await mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
  });
  return mongoose;
};
