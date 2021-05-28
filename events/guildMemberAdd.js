/* eslint-disable no-unused-vars */
const errEmbed = require('../functions/error-embed');
const failureEmbed = require('../functions/failure-embed');
const Discord = require('discord.js');
const punish = require('../models/punishschema');

module.exports = {
	name: 'guildMemberAdd',
	once: false,
	async execute(member, client) {
		punish.find({
			userID: member.user.id,
			guildID: member.guild.id,
			caseType: 'Mute',
		}, async (err, mutes) => {
			const found = mutes.some((m) => m.expires > new Date().getTime());
			if (found) {
				const guild = member.guild;
				const role = await guild.roles.cache.find(
					(r) => r.name.toLowerCase() === 'muted',
				);
				if (role) member.roles.add(role);
			}
		});
	},
};