/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');

module.exports = {
	help: {
		name: 'lockserver',
		description: 'Entirely locks the server.',
		usage: '[reason]',
		aliases: alias.staff.lockserver,
		category: 'staff',
		cooldown: 120,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: ['MANAGE_ROLES'],
		botPerms: ['MANAGE_ROLES', 'MANAGE_CHANNELS'],
		requiredRoles: [],
		delete: true,
	},
	async execute(message, args, client) {
		const reason = args.join(' ');
		const ignored = new Set([
			// Categories
			'831996492347736075',
			'831996493161824267',
			'831996494604140589',
			'842425085910450236',
			'831996498412699668',
			'831996499989889074',
			'831996500816822333',
			'831996501298511923',
			'831996502553133204',
			'839231003864072192',
			'844293566972166144',
			'844065597562421249',
			'846735360050069506',
			'831996506282131546',
		]);
		const testignored = new Set([
			'849347615254118490',
			'849361740164366336',
		]);
		const channels = message.guild.channels.cache.filter(ch => ch.type !== 'category');
		message.channel.send('I\'m locking the server. Please wait...');
		channels.forEach(channel => {
			if (!testignored.has(channel.id)) {
				channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: false }).then(g => {
					console.log(`Updated channel ${g.name} (${g.id}).`);
				}).catch(err => console.log(err));
				channel.send(`<a:error:849037573912657932> The server is locked down for \`${reason}\`. Please refer to <#831996525864419348> for more information.`);
			}
			else {
				console.log(`Skipping ${channel.name} (${channel.id}).`);
			}
		});
		message.channel.send(successEmbed('Successfully locked the server.'));
	},
};