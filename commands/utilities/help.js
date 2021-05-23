const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../json/configuration.json');
const categ = require('../../functions/categories');
const failureEmbed = require('../../functions/failure-embed');
const isenabled = require('../../functions/isenabled');

module.exports = {
	name: 'help',
	description: 'Displays the commands',
	aliases: alias.utilities.help,
	cooldown: 10,
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		if (args[0]) {
			if (categ.validateInput(args[0], categ.valid).length) {
				const category = categ.validateInput(args[0], categ.valid);
				const embed = new MessageEmbed()
					.setAuthor(`Category: ${category}`, client.user.avatarURL())
					.setDescription(`This server's prefix is \`${prefix}\``)
					.setColor('RANDOM')
					.setFooter('hehe boi');
				await client.commands.forEach((cmd) => {
					if (cmd.help.hidden) return;
					if (cmd.help.isAlias) return;
					if (categ.validate(cmd, categ.valid) !== category) return;
					const title = `__${cmd.help.name}__`;
					let field = `**Usage:** \`${prefix}${cmd.help.name} ${cmd.help.usage}\` \n**Desc:** ${cmd.help.description} \n`;
					if (cmd.help.aliases) {
						field += `**Aliases:** ${cmd.help.aliases}`;
					}
					else {
						field += '**Aliases:** None';
					}
					embed.addField(title, field);
				});
				return message.channel.send(embed);
			}
			else {
				if (!client.commands.get(args[0])) {
					return message.channel.send(
						failureEmbed(
							'This command does not exist.',
						),
					);
				}
				const command = client.commands.get(args[0]);
				if (command.help.hidden) {
					return message.channel.send(
						failureEmbed(
							'This command does not exist.',
						),
					);
				}
				const embed = new MessageEmbed()
					.setAuthor(command.help.name, client.user.avatarURL())
					.setColor('RANDOM')
					.setDescription(command.help.description)
					.addField('Category', categ.validate(command, categ.valid));

				if (command.help.usage) {
					embed.addField(
						'Usage',
						`\`\`\`${prefix}${command.help.name} ${command.help.usage}\`\`\``,
					);
				}

				if (command.help.aliases.length) {embed.addField('Aliases', command.help.aliases.join(', '));}
				else {embed.addField('Aliases', 'None');}

				embed.addField('Enabled', isenabled(command.help.enabled));

				return message.channel.send(embed);
			}
		}
		else {
			const embed = new MessageEmbed()
				.setAuthor('Help menu', client.user.avatarURL())
				.setDescription(`This server's prefix is \`${prefix}\``)
				.setFooter('hehe boi')
				.addField(
					'__Categories__',
					`Listed below are all command categories and their respective commands. Use ${prefix}help [command or category] for more information on a specific command or category.`,
				);
			categ.valid.forEach(async (v) => {
				const results = [];
				client.commands.forEach((cmd) => {
					if (cmd.help.hidden) return;
					if (categ.validate(cmd, categ.valid) === v) {
						results.push(cmd.help.name);
					}
				});
				embed.addField(v, `\`${results.join(', ')}\``);
			});
			message.channel.send(embed);
		}
	},
};
