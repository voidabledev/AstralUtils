const punish = require('../models/punishschema');
const blSchema = require('../models/blacklistschema');
/**
 * @param {Object} client The discord.js client.
 * @returns {void} Nothing.
 */
async function interval(client) {
	client.setInterval(() => {
		punish.find({ caseType: 'Mute', isActive: true }, (err, mutes) => {
			if (err) console.error(err);
			const expired = mutes.filter(m => m.expires && m.expires < Date.now());
			expired.forEach(async mute => {
				await punish.updateOne(mute, { isActive: false });
				const guild = client.guilds.cache.get(mute.guildID);
				if (guild) {
					const member = guild.members.cache.get(mute.userID);
					const role = guild.roles.cache.find((r) => r.name.toLowerCase() === 'muted');
					if (member && role) {
						member.roles.remove(role);
					}
				}
			});
		});
		punish.find({ caseType: 'Warn', isActive: true }, (err, warns) => {
			if (err) console.error(err);
			const expired = warns.filter(w => w.expires && w.expires < Date.now());
			expired.forEach(async warn => {
				await punish.updateOne(warn, { isActive: false });
			});
		});
		punish.find({ caseType: 'Blacklist' }, (err, bls) => {
			if (err) console.error(err);
			const expired = bls.filter(b => b.expires && b.expires < Date.now());
			expired.forEach(async b => {
				await blSchema.deleteOne({ userID: b.userID });
			});
		});
	}, 30000);
}
module.exports = interval;