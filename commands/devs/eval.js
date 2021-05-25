// Packages you will need...
const alias = require('../../json/aliases.json');
const conf = require('../../json/configuration.json');
const failEmbed = require('../../functions/failure-embed');
const Discord = require('discord.js');
module.exports = {
	help: {
		name: 'eval',
		description: 'Executes js code. Devs only.',
		usage: '[code]',
		aliases: alias.devs.eval,
		cooldown: 0,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		const silent = args[0].toLowerCase() === 'silent';
		if (silent) args.shift();
		let code = args.join(' ');

		if (!conf.devs.includes(message.author.id)) {
			return message.channel.send(
				failEmbed(
					'You don\'t have permission to use this command!',
					'devs only, noob',
				),
			);
		}

		const embed = new Discord.MessageEmbed();
		if (
			message.content ===
			`${process.argv[2].length ? conf.betaPrefix : conf.prefix}eval 9+10`
		) {
			return message.channel.send('21, You stupid');
		}

		try {
			if (code.startsWith('```js') && code.endsWith('```')) {
				code = code.slice(5, -3);
			}
			let evaled = await eval(code);
			if (silent) return;
			if (code.length > 1000) code = code.substring(0, 1000) + '...';
			if (typeof evaled === 'string' && evaled.length > 800) {
				evaled = evaled.substring(0, 800) + '...';
			}
			embed
				.addField('📥 Input', `\`\`\`js\n${code}\n\`\`\``)
				.addField('📤 Output', `\`\`\`\n${evaled}\n\`\`\``)
				.setColor('GREEN')
				.addField('Status', 'Success');
			return message.channel.send(embed);
		}
		catch (e) {
			console.log(e.stack);
			embed
				.addField('📥 Input', `\`\`\`js\n${code}\n\`\`\``)
				.addField('📤 Output', `\`\`\`\n${e}\n\`\`\``)
				.addField('Status', 'Failed')
				.setColor('GREEN');
			return message.channel.send(embed);
		}
	},
};
