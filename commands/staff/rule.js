/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const failureEmbed = require('../../functions/failure-embed');
const{ MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'rule',
		description: 'Displays a rule.',
		usage: '[rule number]',
		aliases: alias.staff.rule,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: ['MANAGE_MESSAGES'],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		const number = parseInt(args.shift());
		const rules = [
			['Respect', 'Treat everyone in the server with respect, both the staff and the members. Treat everybody how you would want to be treated.'],
			['No Spamming', 'No spamming or flooding text channels. This includes excessive characters or emojis in one message and spamming messages containing the same or similar content. This also includes spam pinging a user.'],
			['No Drama', 'This includes bashing or having heated arguments against other people. Please take these types of things into DMs.'],
			['No Advertising', 'No advertising allowed in the server. This includes DM advertising or posting social media links in text channels. The only place you can advertise is in <#831996540436086884> and <#831996541501308939>.'],
			['Channel Purposes', 'Use channels for their correct purpose. For example, use bot commands in <#831996529425514517> instead of in <#831996525864419348>.'],
			['No NSFW', 'Anything NSFW or 18+ is not allowed on the server. This includes NSFW images, language, and other NSFW topics. Please take it somewhere else.'],
			['No Discrimination', 'No racism or any kind of discrimination against an individual or group (racial slurs are not allowed)'],
			['No Directed Swearing', 'Swearing is allowed, but not if it is directed towards a user or group.'],
			['No Begging', 'No begging or repeatedly asking in the chat for something'],
			['Name and Profile Picture Restrictions', 'No names, nicknames or profile pictures that are offensive towards a user or group of people. Another restriction is to keep nicknames ping-able on the English keyboard.'],
			['English Only', 'Please use the English language throughout the server. If you choose to use another language, please take it to another server or through DMs.'],
			['Alternative Accounts', 'No malicious usage of alternative accounts, especially if used to evade punishments or get more entries on giveaways. If caught, you will be punished.'],
			['No Impersonation', 'Impersonation of people/bots with profile pictures/names isn\'t allowed.'],
			['Interfering Moderators', 'No interfering with moderators\' duties. This includes not arguing with them while they actively moderate, not trolling with fake evidence and not misinforming other users with false information.'],
			['No Earrape', 'Do not cause annoying, loud, or high pitched noises. This includes using music bots to do so, or by screaming/yelling into your microphone.'],
			['Voice Changers', 'Do not use voice changers, soundboards, or other related programs to alter your voice, unless others are fine with it.'],
			['Background Noise', 'No loud or obnoxious background noise. Please mute your microphone, or use push to talk if needed.'],
		];
		if (!rules[number] || isNaN(number)) {
			return message.channel.send(failureEmbed('I couldn\'t find the rule you requested!'));
		}
		const embed = new MessageEmbed()
			.setTitle(`Rule ${number}: ${rules[number - 1][0]}`)
			.setDescription(rules[number - 1][1])
			.setFooter(`Requested by: ${message.author.tag}`)
			.setTimestamp();
		message.channel.send(embed);
	},
};