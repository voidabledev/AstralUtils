/* eslint-disable no-unused-vars */
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
			inv: true,
			async execute(message, amount) {
				try {
					await message.member.roles.add('831996404549419018');
					return 'Take the role, you earned it.';
				}
				catch {
					throw new Error('You already have the role, or I\'m missing permissions.');
				}
			},
		},
	],
};

module.exports = eco;