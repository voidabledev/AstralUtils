const punish = require('../models/punishschema');
const blSchema = require('../models/blacklistschema');
async function interval(client) {
	client.setInterval(() => {
		punish.find({ caseType: 'Mute' }, (err, mutes) => {
			if (err) console.error(err);
			const expired = mutes.filter(m => m.expires && m.expires < Date.now());
			expired.forEach(mute => {
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
		punish.find({ caseType: 'Ban' }, (err, bans) => {
			if (err) console.error(err);
			const expired = bans.filter(b => b.expires && b.expires < Date.now());
			expired.forEach(ban => {
				const guild = client.guilds.cache.get(ban.guildID);
				if (guild) {
					try {
						guild.members.unban(ban.userID);
					}
					catch (e) {
						console.log(`Unable to unban user ${ban.userID}`);
					}
				}
			});
		});
		punish.find({ caseType: 'Warn' }, (err, warns) => {
			if (err) console.error(err);
			const expired = warns.filter(w => w.expires && w.expires < Date.now());
			expired.forEach(warn => {
				punish.deleteOne(warn);
			});
		});
		punish.find({ caseType: 'Blacklist' }, (err, bls) => {
			if (err) console.error(err);
			const expired = bls.filter(b => b.expires && b.expires < Date.now());
			expired.forEach(b => {
				blSchema.deleteOne({ userID: b.userID });
			});
		});
	}, 30000);
}
module.exports = interval;