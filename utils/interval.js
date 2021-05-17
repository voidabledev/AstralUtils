module.exports = (client) => {
  client.setInterval(async () => {
    const mongo = require("../mongo");
    const punishSchema = require("../schemas/punishschema");
    const muteSchema = require("../schemas/muteschema");
    const warnSchema = require("../schemas/warnschema");
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
  }, 30000);
};
