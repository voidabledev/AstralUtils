const conf = require('../json/configuration.json');
const { GiveawaysManager } = require('discord-giveaways');
const gwSchema = require('../models/gwschema');
/**
 * Sets up the giveaways manager.
 * @param {Object} client The discord.js client.
 * @returns {void} Nothing.
 */
async function giveaways(client) {
	const GiveawayDatabase = class extends GiveawaysManager {
		async getAllGiveaways() {
			return await gwSchema.find({});
		}
		async saveGiveaway(messageID, gwData) {
			await gwSchema.create(gwData);
			return;
		}
		async editGiveaway(messageID, gwData) {
			await gwSchema.findOneAndUpdate({ messageID }, gwData).exec();
			return;
		}
		async deleteGiveaway(messageID) {
			await gwSchema.findOneAndDelete({ messageID }).exec();
			return;
		}
	};
	const manager = new GiveawayDatabase(client, {
		updateCountdownEvery: 5000,
		default: {
			botsCanWin: false,
			embedColor: '#00ff66',
			reaction: '🎉',
		},
	});
	client.giveawaysManager = manager;
	client.giveawaysManager.limitPerDay = conf.giveawaysPerDay;
}

module.exports = giveaways;