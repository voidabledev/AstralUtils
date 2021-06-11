/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const ms = require('../../functions/ms');
const { MessageEmbed } = require('discord.js');
const blacklist = require('../../models/blacklistschema.js');

module.exports = {
	help: {
		name: 'gstart',
		description: 'Starts a giveaway',
		usage: '(optional: noping) [channel] [time] [winners] [prize]',
		aliases: alias.giveaways.gstart,
		category: 'giveaways',
		cooldown: 10,
	},
	data: {
		minArgs: 4,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['831996436333592586', '851144985800736788'],
		delete: false,
	},
	async execute(message, args, client) {
		const limit = client.giveawaysManager.limitPerDay;
		let ping = true;
		if (args[0].toLowerCase() === 'noping') {
			ping = false;
			args.shift();
		}

		let giveawayChannel = message.mentions.channels.first();
		if (args[0] === 'here') giveawayChannel = message.channel;
		if (!giveawayChannel) {
			return message.channel.send(
				failureEmbed('You need to provide a channel, or use the "here" keyword.'),
			);
		}
		args.shift();
		const giveawayDuration = args.shift();
		if (!giveawayDuration || ms(giveawayDuration) < 0) {
			return message.channel.send(
				failureEmbed('You have to specify a valid duration!', 'dummy'),
			);
		}

		const giveawayNumberWinners = args.shift();
		if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
			return message.channel.send(
				failureEmbed(
					'You have to specify a valid number of winners!',
					'dummy',
				),
			);
		}

		const giveawayPrize = args.join(' ');

		const withinaday = client.giveawaysManager.giveaways.filter(
			(g) => new Date().getTime() - g.startAt < 1000 * 60 * 60 * 24,
		);
		let stop;
		if (withinaday.length >= limit) {
			if (message.member.hasPermission('ADMINISTRATOR')) {
				const em = new MessageEmbed()
					.setTitle('Attention!')
					.setDescription(`There were already ${withinaday.length} giveaways within the last day. Respond with yes if you want to host this giveaway anyways.`)
					.setFooter('Say anything else to cancel')
					.setColor('ORANGE');
				await message.channel.send(em);
				await message.channel
					.awaitMessages((m) => m.author.id === message.author.id, {
						max: 1,
						time: 60000,
						errors: ['time'],
					})
					.then((m) => {
						if (m.first().content.toLowerCase() === 'yes') {stop = false;}
						else {
							stop = true;
							message.channel.send('Giveaway creation cancelled.');
						}
					})
					.catch(() => {
						stop = true;
						message.channel.send(
							'You didn\'t answer in time, giveaway creation cancelled.',
						);
					});
			}
			else {
				stop = true;
				message.channel.send(
					failureEmbed(
						`There are already ${withinaday.length} giveaways hosted within the last day, but only ${limit} are allowed!`,
						'Message an admin if this needs to be hosted anyways.',
					),
				);
			}
		}
		if (stop) return;
		await client.giveawaysManager.start(giveawayChannel, {
			exemptMembers: async (member) => {
				return await blacklist.findOne({ userID: member.user.id });
			},
			bonusEntries: [
				{
					bonus: (member) => member.roles.cache.get('836325180842049567') ? 1 : null,
					cumulative: true,
				},
				{
					bonus: (member) => member.roles.cache.get('831996438716088320') ? 1 : null,
					cumulative: true,
				},
			],
			time: ms(giveawayDuration),
			prize: giveawayPrize,
			winnerCount: parseInt(giveawayNumberWinners),
			hostedBy: message.author,
			_messages: {
				giveaway: (ping
					? '<@&831996472458477588>\n'
					: '') + '🎉 **GIVEAWAY** 🎉',
				_giveawayEnded: (ping
					? '<@&831996472458477588>\n'
					: '') + '🎉 **GIVEAWAY ENDED** 🎉',
				get giveawayEnded() {
					return this._giveawayEnded;
				},
				set giveawayEnded(value) {
					this._giveawayEnded = value;
				},
				timeRemaining: 'Time remaining: **{duration}**!',
				inviteToParticipate: 'React with 🎉 to participate!',
				winMessage: 'Congratulations, {winners}! You won **{prize}**!',
				embedFooter: 'Giveaways',
				embedColor: '#00ff66',
				noWinner: 'Giveaway cancelled, no valid participations.',
				hostedBy: 'Hosted by: {user}',
				winners: 'winner(s)',
				endedAt: 'Ended at',
				units: {
					seconds: 'seconds',
					minutes: 'minutes',
					hours: 'hours',
					days: 'days',
					pluralS: false,
				},
			},
			get messages() {
				return this._messages;
			},
			set messages(value) {
				this._messages = value;
			},
		});

		message.channel.send(
			successEmbed(
				`Giveaway started in ${giveawayChannel}`,
				`${withinaday.length + 1} giveaways hosted within the last 24 hours`,
			),
		);
	},
};