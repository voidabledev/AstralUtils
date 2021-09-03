/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import {
	MessageEmbed,
	Message,
} from 'discord.js';
import { success, fail, confirm } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { wait } from '../../structures/utils';

const aliases = [
	{
		name: 'Assist',
		values: ['How can we assist you today?'],
	},
	{
		name: 'Trolling',
		values: ['Please note that trolling is strictly forbidden. If you are caught doing this again, you will be bot blocked.', 'With that being said, are there any more questions, comments, or concerns you have for today?'],
	},
	{
		name: 'Custom Role',
		values: ['Please provide the name of the role and the hex code.'],
	},
	{
		name: 'Giveaway Format',
		values: ['**Prize:**\n**Duration:**\n**Requirement:**\n**Claim Time:**\n**Message from Host:**', 'Please fill this out.'],
	},
	{
		name: 'Partner Requirements',
		values: ['**__Partnership Requirements__**\n➥ Your server must follow the Discord TOS and Guidelines.\n\n➥ You must have a visible Partners channel.\n➥ We won\'t ping or mention anyone. @everyone and @here will be removed.\n➥ Your server should not be NSFW or contain any NSFW content.\n➥ Your server shouldn\'t be completely inactive.\n➥ If you have less than 100 members, you need to ping @everyone.', 'Do you meet these requirements?'],
	},
	{
		name: 'Our Ad',
		values: ['```\n▬▬▬▬▬▬▬ **__Astral Galaxy__** ▬▬▬▬▬▬▬\n> A simple & chill community server.\n> We welcome everyone from everywhere\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n**__Here you can find:__**\n> `🎉` • Frequent giveaways, including **Nitro**!\n> `💫` • Weekly **fun events**, with various prizes\n> `⭐` • **Rewards** for supporting the server\n> `🔮` • **Amazing** and **supportive** staff team\n> `🌈` • **A growing** and **active** community\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n> 🔗 **__Invite Link:__** https://discord.gg/8HnfNaXP9m\n> 🔗 **__Line:__** https://imgur.com/rkr2smr\n> 🔗 **__Banner:__** https://cdn.discordapp.com/attachments/821100521392701460/875414426306625596/standard_11.gif\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n```', 'Please send our ad and post a screenshot.'],
	},
];

export const command: Command = {
	name: 'alias',
	description: 'Use and view shortcuts for interacting in a modmail thread.',
	options: [
		{
			type: Options.Subcommand,
			name: 'use',
			description: 'Use an alias in a modmail thread.',
			options: [
				{
					type: Options.Integer,
					name: 'alias',
					description: 'The name of the alias you want to use.',
					required: true,
					choices: aliases.map((a, i) => {
						return {
							name: a.name,
							value: i,
						};
					}),
				},
				{
					type: Options.Boolean,
					name: 'anon',
					description: 'Whether or not to reply anonymously (default: true)',
				},
				{
					type: Options.Boolean,
					name: 'plain',
					description: 'Whether or not to reply with a plain message instead of an embed (default: false)',
				},
			],
		},
		{
			type: Options.Subcommand,
			name: 'view',
			description: 'View information on an alias.',
			options: [
				{
					type: Options.Integer,
					name: 'alias',
					description: 'The name of the alias you want to view.',
					required: true,
					choices: aliases.map((a, i) => {
						return {
							name: a.name,
							value: i,
						};
					}),
				},
			],
		},
	],
	async run(interaction, options, client) {
		const modmail = client.modmail.getByChannel(interaction.channel.id);
		const i = options.getInteger('alias', true);
		const sub = options.getSubcommand(true);
		if (!modmail) {
			return interaction.reply({
				embeds: [fail('This isn\'t a modmail thread!')],
				ephemeral: true,
			});
		}
		if (sub === 'use') {
			if (modmail.staffId && modmail.staffId !== interaction.user.id) {
				return interaction.reply({
					embeds: [fail(`This thread is claimed by <@${modmail.staffId}>! You can't reply to it unless you claim it for yourself!`)],
				});
			}
			const anon = options.getBoolean('anon') ?? true;
			const plain = options.getBoolean('plain') ?? false;

			const uEmbeds = aliases[i].values.map((value) => {
				return new MessageEmbed()
					.setAuthor(
						anon ? 'Support Team' : interaction.user.tag,
						anon ? interaction.guild.iconURL({ dynamic: true }) : interaction.user.displayAvatarURL({ dynamic: true }),
					)
					.setDescription(value)
					.setFooter('Response')
					.setTimestamp()
					.setColor('GREEN');
			});
			const cEmbeds = aliases[i].values.map((value) => {
				return new MessageEmbed()
					.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
					.setDescription(value)
					.setColor('GREEN')
					.setTimestamp()
					.setFooter(`${plain ? 'Plain ' : ''}${anon ? 'Anonymous ' : ''}Reply`);
			});
			const user = await client.users.fetch(modmail.userId);
			let m1: Message;
			try {
				m1 = await user.send(!plain ? {
					embeds: uEmbeds,
				} : {
					content: anon ? `*Support Team:*\n${aliases[i].values.join('\n\n')}` : `*${interaction.user.tag}:*\n${aliases[i].values.join('\n\n')}`,
				});
			}
			catch (e) {
				return interaction.reply({
					embeds: [fail(`I was unable to send a message to ${user}!`)],
				});
			}

			const m2 = await interaction.reply({
				embeds: cEmbeds,
				fetchReply: true,
			});
			await client.modmail.addMessage(
				modmail.channelId, aliases[i].values.join('\n\n'), [m1.id, m2.id], interaction.user.id,
			);
		}

		if (sub === 'view') {
			const embed = new MessageEmbed()
				.setTitle(`Alias: ${aliases[i].name}`)
				.setColor('GREY')
				.addFields(aliases[i].values.map((v, j) => {
					return {
						name: `Step ${j + 1}`,
						value: v,
					};
				}))
				.setFooter('Aliases can be used anonymously and with plain messages')
				.setTimestamp();

			await interaction.reply({ embeds: [embed] });
		}
	},
};
