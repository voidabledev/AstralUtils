module.exports = (client) => {
  client.setInterval(async () => {
    const mongo = require("../mongo");
    const punishSchema = require("../schemas/punishschema");
    const muteSchema = require("../schemas/muteschema");
    const intervalSchema = require("../schemas/intervalschema");
    const warnSchema = require("../schemas/warnschema");
    await mongo().then(async (mongoose) => {
      try {
        await punishSchema.find({}, async (err, entries) => {
          if (err) throw err;
          entries.map(async (entry) => {
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
        await intervalSchema.find({}, async (err, entries) => {
          if (err) throw err;
          entries.map(async (entry) => {
            if (entry.expires < new Date().getTime()) {
              await intervalSchema.deleteOne(entry);
              return;
            }
            if (new Date().getTime() - entry.executed > entry.interval) {
              const guild = client.guilds.cache.get("831995980097388604");
              const channel = guild.channels.cache.get(entry.channelId);
              channel.send(entry.message);
              await intervalSchema.findOneAndUpdate(
                {
                  interval: entry.interval,
                  expires: entry.expires,
                },
                {
                  executed: new Date().getTime(),
                }
              );
            }
          });
        });
        await warnSchema.find({}, async (err, users) => {
          if (err) throw err;
          users.forEach(async (user) => {
            await user.warnings.forEach(async (warn) => {
              if (
                new Date().getTime() - warn.timestamp >
                1000 * 60 * 60 * 24 * 30
              ) {
                await warnSchema.findOneAndUpdate(user, {
                  $pull: {
                    warnings: warn,
                  },
                });
              }
            });
          });
        });
      } finally {
        mongoose.connection.close();
      }
    });
  }, 30000);
};
