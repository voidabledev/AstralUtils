// Packages you will need...
const alias = require('../../json/aliases.json');

module.exports = {
  name: 'ban',
  description: 'Bans a user',
  aliases: ['b'] || aliases.mod.ban,
  cooldown: 10,
  // eslint-disable-next-line no-unused-vars
  async execute(message, args, client) {
    // Code here
  },
};
