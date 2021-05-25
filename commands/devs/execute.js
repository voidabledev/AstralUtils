/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const { exec } = require('child_process');
const alias = require('../../json/aliases.json');
module.exports = {
	name: 'execute',
	description: 'Execute something in the terminal',
	aliases: ['exec'] || alias.devs.execute,
	cooldown: 10,
	async execute(message, args) {
		if(message.member.roles.cache.has('841804547000893490')) {
			const codeExec = args.join(' ');
			if(!codeExec) return message.channel.send('Alright, we arent executing anything today');
			exec(codeExec, async(err, stdout, stderr));
		}
		else{ return message.delete(); }
	},
};