/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { exec } = require('child_process');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'pull',
		description: 'Pulls something from the repo',
		usage: '',
		aliases: alias.devs.pull,
		category: 'developers',
		cooldown: 15,
	},
	data: {
		minArgs: 0,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['841804547000893490'],
		delete: false,
	},
	async execute(message, args, client) {
		exec('git pull', (error, stdout, stderr) =>{
			if (error) {
				const embed = new MessageEmbed()
					.setColor('RED')
					.setTitle('Error')
					.addFields(
						{ name: 'Stdout', value: `\`\`\`sh\n${stdout}\n\`\`\``, inline: false },
						{ name: 'Stderr', value: `\`\`\`sh\n${stderr}\n\`\`\``, inline: false },
					)
					.setFooter('Check the terminal of the VPS')
					.setTimestamp();
				message.author.send(embed);
			}
			const embedSuccess = new MessageEmbed()
				.setColor('GREEN')
				.setTitle('Pulled')
				.addFields(
					{ name: 'Stdout', value: `\`\`\`sh\n${stdout}\n\`\`\``, inline: false },
					{ name: 'Stderr', value: `\`\`\`sh\n${stderr}\n\`\`\``, inline: false },
				)
				.setDescription('Please restart the bot depending on the changes')
				.setFooter('This command was made to avoid pulling every time you push a commit')
				.setTimestamp();
			message.author.send(embedSuccess);
		});
	},
};