/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');

module.exports = {
	help: {
		name: 'unlockserver',
		description: 'Entirely unlocks the server.',
		usage: '[reason]',
		aliases: alias.staff.unlockserver,
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
		let amount = 0;
		const ignored = new Set([
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
		]);
		const channels = message.guild.channels.cache.filter(ch => ch.type === 'text' && !ignored.has(ch.parent ? ch.parent.id : ch.id) && !ignored.has(ch.id));
		message.channel.send('<a:loading:855829253429264405> I\'m unlocking the server. Please wait...');
		channels.forEach((channel) => {
			if (!channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) {
				channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: true });
				amount++;
				if (channel.id !== message.channel.id) channel.send(`<a:error:849037573912657932> The server has been unlocked for \`${reason}\`. You may talk now.`);
			}
		});
		if (amount > 0) {
			message.channel.send(successEmbed(`Succesfully unlocked \`${amount}\` channels.`));
		}
		else {
			message.channel.send(failureEmbed('The server is already unlocked.'));
		}
	},
};