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

  client.giveawaysManager.on(
    "giveawayReactionAdded",
    async (giveaway, member, reaction) => {
      if (await client.blacklisted(member.id)) {
        return reaction.message.reactions
          .resolve(reaction)
          .users.remove(member.id);
      }
      console.log(
        `${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`
      );
    }
  );
  client.giveawaysManager.on(
    "giveawayReactionRemoved",
    (giveaway, member, reaction) => {
      console.log(
        `${member.user.tag} unreact to giveaway #${giveaway.messageID} (${reaction.emoji.name})`
      );
    }
  );
  client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
    console.log(
      `Giveaway #${giveaway.messageID} ended! Winners: ${winners
        .map((member) => member.user.username)
        .join(", ")}`
    );
  });
};
