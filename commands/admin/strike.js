const alias = require('../../json/aliases.json');

module.exports = {
  name: 'strike',
  description: 'Strikes a staff member',
  aliases: ['s'] || alias.commandCategory.commandName,
  cooldown: 5,
  // eslint-disable-next-line no-unused-vars
  async execute(message, args, client) {
    // Code here
  },
};
