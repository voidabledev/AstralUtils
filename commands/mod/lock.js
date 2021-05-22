// Packages you will need...
const alias = require('../../json/aliases.json');

module.exports = {
  name: 'lock',
  description: 'Locks a channel',
  aliases: ['l'] || alias.mod.lock,
  cooldown: 30,
  // eslint-disable-next-line no-unused-vars
  async execute(message, args, client) {
    // Code here
  },
};
