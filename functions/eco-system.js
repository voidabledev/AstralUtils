/* eslint-disable no-unused-vars */
const ecos = require('../models/ecoschema');
const eco = {
	/**
	 * All available items.
	 */
	items: [
		{
			name: 'vip',
			displayName: 'VIP Role',
			cost: 200000,
			description: 'A high role position.',
			inv: false,
			async allowed(message) {
				return;
			},
			async execute(message, amount) {
				try {
					await message.member.roles.add('831996439260430388');
					return 'Take the role, you earned it.';
				}
				catch {
					throw new Error('You already have the role, or I\'m missing permissions.');
				}
			},
		},
		{
			name: 'gold',
			displayName: 'Golden Coin',
			cost: 50000,
			description: 'An expensive golden coin, mainly to flex on normies.',
			inv: true,
			async allowed(message) {
				return;
			},
			async execute(message, amount) {
				throw new Error('You can\'t use this item!');
			},
		},
		{
			name: 'gamble',
			displayName: 'Gambler\'s horseshoe',
			cost: 10000,
			description: 'Gives you higher outcome when gambling, but breaks when you lose.',
			inv: true,
			async allowed(message) {
				return;
			},
			async execute(message, amount) {
				throw new Error('You can\'t use this item!');
			},
		},
		{
			name: 'time',
			displayName: 'Time Machine',
			cost: 20000,
			description: 'Reduces all of your currently ongoing cooldowns by 1 hour.',
			inv: true,
			async allowed(message) {
				return;
			},
			async execute(message, amount) {
				message.client.cooldowns.forEach((timestamps) => {
					const cooldown = timestamps.get(message.author.id);
					if (cooldown) {
						timestamps.set(message.author.id, cooldown - 3600000 * amount);
					}
				});
				return `Reduced your cooldowns by ${amount} hours.`;
			},
		},
		{
			name: 'chill',
			displayName: 'Chill Pill',
			cost: 1000,
			description: 'Removes all your currently ongoing cooldowns under 20 seconds.',
			inv: true,
			async allowed(message) {
				return;
			},
			async execute(message, amount) {
				message.client.cooldowns.forEach((timestamps) => {
					const cooldown = timestamps.get(message.author.id);
					if (Date.now() - cooldown < 20000) {
						timestamps.delete(message.author.id);
					}
				});
				return 'Cooldowns have been removed.';
			},
		},
	],
};

module.exports = eco;