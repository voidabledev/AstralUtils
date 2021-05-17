module.exports = (client) => {
  const { GiveawaysManager } = require("discord-giveaways");
  const gwSchema = require("../schemas/gwschema");
  const GiveawayDatabase = class extends GiveawaysManager {
    async getAllGiveaways() {
      return await gwSchema.find({});
    }
    async saveGiveaway(messageID, gwData) {
      await gwSchema.create(gwData);
      return;
    }
    async editGiveaway(messageID, gwData) {
      await gwSchema.findOneAndUpdate({ messageID }, gwData).exec();
      return;
    }
    async deleteGiveaway(messageID) {
      await gwSchema.findOneAndDelete({ messageID }).exec();
      return;
    }
  };
  const manager = new GiveawayDatabase(client, {
    updateCountdownEvery: 5000,
    default: {
      botsCanWin: false,
      embedColor: "#00ff66",
      reaction: "🎉",
    },
  });
  client.giveawaysManager = manager;
};
