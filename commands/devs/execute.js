/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { exec } = require('child_process');
const alias = require('../../json/aliases.json');
const devs = require('../../json/configuration.json').devs;
const { MessageEmbed } = require('discord.js');
module.exports = {
	help: {
		name: 'execute',
		description: 'Execute something in the terminal',
		usage: '[new activity]',
		aliases: alias.devs.execute,
		cooldown: 10,
	},
	data: {
		minArgs: 0,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args) {
		if(!devs.includes(message.author.id)) return message.delete();
		const codeExec = args.join(' ');
		if(!codeExec) return message.channel.send('Alright, we arent executing anything today');
		try {
			message.channel.send('Starting to execute now. You will see the output once I\'m done.');
			exec(codeExec, async (err, stdout, stderr) => {
				const embed = new MessageEmbed()
					.setTitle('Shell Execution')
					.addField('Input', `\`\`\`\n${codeExec}\n\`\`\``);
				if(stdout) {
					embed
						.addField('Output', `\`\`\`\n${stdout.slice(0, 1023)}\n\`\`\``)
						.setColor('GREEN');
				}
				if(err) {
					embed
						.addField('Output', `\`\`\`\nError: ${err.name}\n${err.message.slice(0, 900)}${err.message.length > 900 ? '...' : ''}\n\`\`\``)
						.setColor('RED');
				}
				message.channel.send(embed);
			});
		}
		catch (e) {
			const em = new MessageEmbed()
				.setTitle('Shell Execution')
				.setDescription('I was unable to execute this statement.')
				.addField('Error', `\`\`\`\n${e}\n\`\`\``);
			message.channel.send(em);
		}
	},
};