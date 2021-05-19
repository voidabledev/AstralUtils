const Discord = require("discord.js");
module.exports = (client) => {
  client.setInterval(async () => {
    const mongo = require("../mongo");
    const punishSchema = require("../schemas/punishschema");
    const muteSchema = require("../schemas/muteschema");
    const warnSchema = require("../schemas/warnschema");
    const blSchema = require("../schemas/blacklistschema");
    punishSchema.find({}, async (err, entries) => {
      if (err) console.error(err);
      let filtered = entries.filter(
        (e) => e.expires.getTime() < new Date().getTime()
      );
      filtered.forEach(async (entry) => {
        await client.expire[entry._type](entry.userId, entry.guildId, client)
          .then(async (reason) => {
            console.log(reason);
            await punishSchema.deleteOne({
              _type: entry._type,
              userId: entry.userId,
              guildId: entry.guildId,
            });
            await muteSchema.deleteOne({
              userId: entry.userId,
              guildId: entry.guildId,
            });
          })
          .catch((err) => console.log(err));
      });
    });
    await warnSchema.find({}, async (err, users) => {
      if (err) console.error(err);
      users.map(async (user) => {
        await user.warnings.map(async (warn) => {
          if (
            new Date().getTime() - warn.timestamp >
            1000 * 60 * 60 * 24 * 30
          ) {
            await warnSchema.findOneAndUpdate(
              {
                userId: user.userId,
                guildId: user.guildId,
              },
              {
                $pull: {
                  warnings: warn,
                },
              }
            );
          }
        });
      });
    });
    await blSchema.find({}, async (err, blacklists) => {
      if (err) console.error(err);
      const filtered = blacklists.filter(
        (b) => b.expires < new Date().getTime()
      );
      filtered.forEach(async (bl) => {
        await blSchema.deleteOne({ userId: bl.userId });
        const modlog = {
          author: "System",
          reason: "Timed blacklist expired after 7 days",
          caseID: 0,
          timestamp: new Date().getTime(),
          _type: "Unblacklist",
        };
        await client.setModlog(bl.userId, bl.guildId, modlog, client);
        try {
          const user = client.users.fetch(bl.userId);
          const guild = client.guilds.cache.get(bl.deleteOne.guildId);
          user.send(
            new Discord.MessageEmbed().setDescription(
              `Your blacklist has expired. You can now take part in giveaways again.`
            )
          );
        } catch (e) {}
      });
    });
  }, 30000);
};
