import { Interaction, MessageEmbed, MessageSelectMenu } from 'discord.js';
import { Event } from '../typings/event';
import { success, fail } from '../modules/embeds';
import { categories } from './modmail';

export const event: Event = {
	event: 'interactionCreate',
	async run(client, interaction: Interaction) {
		if (!interaction.isSelectMenu()) return;

		if (interaction.customId.startsWith('select-modmail-topic-')) {
			const category = categories.find((c, i) => i === +interaction.values[0]);
			const guild = client.guilds.cache.get(category.guildId);
			if (!guild) {
				return interaction.update({
					embeds: [fail('I was unable to find the server thism modmail was supposed to belong to. If you think this is a bug, please message a developer.')],
					components: [],
				});
			}
			const message = (await interaction.channel.messages.fetch({ limit: 2 }))
				.find((m) => m.author.id === interaction.user.id);
			const member = await guild.members.fetch(interaction.user.id);
			const channel = await guild.channels.create(
				`${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}`,
				{
					type: 'GUILD_TEXT',
					topic: `**User ID:** ${interaction.user.id}\n**Category:** ${category.name}\n**Claimed:** This thread isn't claimed yet!`,
					parent: category.categoryId,
				},
			);

			await interaction.update({
				embeds: [success('Your modmail thread has been created. Please wait, a staff member will be here to assist you shortly.')],
				components: [],
			});
			const embed = new MessageEmbed()
				.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
				.setDescription(`${interaction.user} was created <t:${
					Math.floor(interaction.user.createdTimestamp / 1000)
				}:R>, joined the server <t:${
					Math.floor(member.joinedTimestamp / 1000)
				}:R>, with **${client.modmail.getPrevious(interaction.user.id).size}** past threads.`)
				.addField('Roles', member.roles.cache.filter((r) => r.id !== guild.id).map(role => role.toString()).join(', '))
				.setFooter(`User ID: ${interaction.user.id}`)
				.setTimestamp();
			await channel.send({
				content: category.ping,
				embeds: [embed],
			});
			const m1 = await channel.send({
				embeds: [new MessageEmbed().setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true })).setDescription(message.content).setColor('ORANGE').setFooter('Thread Creation').setTimestamp()],
			});
			await client.modmail.create({
				userId: interaction.user.id,
				channelId: channel.id,
				messages: [{
					content: message.content,
					messageIds: [message.id, m1.id],
					author: interaction.user.id,
				}],
				closed: false,
			});
		}
	},
};
