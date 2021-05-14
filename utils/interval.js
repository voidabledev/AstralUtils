module.exports = (client) => {
  client.setInterval(async () => {
    const mongo = require("../mongo");
    const punishSchema = require("../schemas/punishschema");
    const muteSchema = require("../schemas/muteschema");
    const warnSchema = require("../schemas/warnschema");
    await mongo().then(async (mongoose) => {
      try {
        await punishSchema.find({}, async (err, entries) => {
          if (err) throw err;
          await entries.forEach(async (entry) => {
            if (entry.expires.getTime() < new Date().getTime()) {
              await client.expire[entry._type](
                entry.userId,
                entry.guildId,
                client
              );
              await punishSchema.deleteOne({
                _type: entry._type,
                userId: entry.userId,
                guildId: entry.guildId,
              });
              await muteSchema.deleteOne({
                userId: entry.userId,
                guildId: entry.guildId,
              });
            }
          });
        });
        /*await warnSchema.find({}, async (err, users) => {
          if (err) throw err;
          await users.forEach(async (user) => {
            await user.warnings.forEach(async (warn) => {
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
        });*/
      } finally {
        mongoose.connection.close();
      }
    });
  }, 30000);
};
