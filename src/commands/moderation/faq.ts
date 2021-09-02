/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { Permissions, MessageEmbed } from 'discord.js';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
const faqs = [
	['How do I apply for staff?', 'Visit <#850404095960285244>. Once you meet the requirements, you may apply.'],
	['Why can\'t I type in advertising channels?', 'Advertising is unlocked for those who are Level 5+, have voted for the server through top.gg, or have boosted the server. Exclusive ads is unlocked for those who have boosted the server, or are Level 50+.'],
	['How do I get [x] role?', 'Visit <#831996507976106085> for role information.'],
	['Why is my nickname "Moderated Nickname"?', 'Your nickname is moderated because it contains letters and symbols outside of the English language, and can\'t be pinged. If you would like to request a change, please ask a staff member for help.'],
	['How do I check my level?', 'You can level up by chatting in text channels. Type the command `/level` in the bot channels to check your current level.'],
	['What does boosting do?', 'Certain amounts of boosts grant servers few new perks. On our server you also gain personal benefits!'],
	['How do I enter a giveaway?', 'Make sure you have fulfilled the requirement(s) of the giveaway and then react to the giveaway message.'],
];

export const command: Command = {
	name: 'faq',
	description: 'Displays the requested FAQ.',
	options: [
		{
			type: Options.Integer,
			name: 'faq',
			description: 'The FAQ number.',
			required: true,
			choices: faqs.map((faq, i) => {
				return {
					name: `FAQ #${i < 14 ? i + 1 : i - 13}: ${faq[0]}`,
					value: i,
				};
			}),
		},
	],
	async allowed(interaction, client) {
    		return (
			(interaction.guild &&
				(interaction.member?.permissions as Readonly<Permissions>)?.has?.(
					'MANAGE_MESSAGES',
				)) ??
			false
		);
	},
	async run(interaction, options, client) {
		const faq = options.getInteger('faq', true);
		const embed = new MessageEmbed()
			.setAuthor(`FAQ #${faq}: ${faqs[faq][0]}`, interaction.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setDescription(faqs[faq][1])
			.setColor('RANDOM')
			.setFooter(`Requested By: ${interaction.user.tag}`);
		interaction.reply({
			embeds: [embed],
		});
	},
};