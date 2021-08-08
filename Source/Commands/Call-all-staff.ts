import { Command } from '../Typings/Command';
import { success, fail, confirm } from '../Modules/Embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'call-all-staff',
	description: 'Pings all staff members. Useful only in case of emergency.',
	options: [
		{
			name: 'text',
			description: 'Additional text to ping all staff members with.',
			type: Options.String,
		},
	],
	async run(interaction, options, client) {
		const cooldown = client.globalCooldowns.get(command.name);
		const now = new Date();
		const text = options.getString('text');
		if (cooldown && now.getTime() - cooldown.getTime() < 1000 * 60 * 60 * 2) {
			return interaction.reply({
				embeds: [fail(`This command is on cooldown. Try again <t:${Math.floor((cooldown.getTime() + 1000 * 60 * 60 * 2) / 1000)}:R>`)],
			});
		}
		try {
			await confirm(interaction, 'Are you sure you want to call all staff?');
			await confirm(interaction, 'This is only useful in case of an emergency, like a raid. Are you sure you want to proceed?');
			await confirm(interaction, 'Using this command with no reason will result in a harsh punishment. Do you really wish to ping all staff members?');
			await interaction.editReply({
				embeds: [success('Pinging all staff now...')],
				components: [],
			});
			await interaction.followUp({
				content: `<@&831996404549419018>${text ? `\n\`${text}\`` : ''}`,
			});
			client.globalCooldowns.set(command.name, now);
		}
		catch {
			await interaction.editReply({
				embeds: [fail('Cancelled.')],
				components: [],
			});
		}
	},
};