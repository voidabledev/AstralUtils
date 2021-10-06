/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { devs } from '../../config.json';
import { success } from '../../structures/embeds';
import { exec } from 'child_process';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const command: Command = {
	name: 'restart',
	description: 'Deploys new code changes and restarts the process [Developer only]',
	async allowed(interaction, client) {
		return devs.includes(interaction.user.id);
	},
	async run(interaction, options, client) {
		await interaction.reply({ embeds: [success('Restarting now... This process may take up to two minutes.')] });
		client.user.setStatus("idle");
		exec('git pull && pm2 restart all');
	},
};
