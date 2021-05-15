const mongo = require("../mongo");
const punishSchema = require("../schemas/punishschema");
const muteSchema = require("../schemas/muteschema");
module.exports = async (member) => {
  await mongo().then(async (mongoose) => {
    try {
      const found = await muteSchema.findOne({
        userId: member.user.id,
        guildId: member.guild.id,
      });
      if (found) {
        const guild = member.guild;
        const role = await guild.roles.cache.find(
          (r) => r.name.toLowerCase() === "muted"
        );
        if (role) member.roles.add(role);
      }
    } finally {
      mongoose.connection.close();
    }
  });
};
