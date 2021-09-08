/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageEmbed, Permissions } from 'discord.js';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

const data = {
	rules: [
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
		['Toxicity', 'Keep swearing at a minimum. Directly swearing at someone is not allowed. Any forms of slurs and general toxicity is not allowed.'],
		['No Earrape', 'Do not cause annoying, loud, or high pitched noises. This includes using music bots to do so, or by screaming/yelling into your microphone.'],
		['Voice Changers', 'Do not use voice changers, soundboards, or other related programs to alter your voice, unless others are fine with it.'],
		['Background Noise', 'No loud or obnoxious background noise. Please mute your microphone, or use push to talk if needed.'],
	],
	faq: [
		['Important links', '**Welcome to Astral Galaxy**\n> Welcome to our server. We are a simple and chill community server, that welcomes everyone. We offer fun giveaways and events, and a welcoming community.\n\n**Important Links**\n> Important links relating to the server\n\n**Server Invites**\n> Vanity Invite: https://discord.gg/belugang\n> Permanent Invite: https://discord.gg/8HnfNaXP9m\n\n**Server Listings**\n> Voting Link: https://top.gg/servers/831995980097388604/vote\n> Disboard Profile: https://disboard.org/server/831995980097388604\n> Arcane Level Leaderboard: https://arcane.bot/lb/astralgalaxy'],
		['How do I apply for staff?', 'Visit <#850404095960285244>. Once you meet the requirements, you may apply.'],
		['Why can\'t I type in the advertising channels?', '<#831996540436086884> is unlocked for those who are Level 5+, have voted for the server through top.gg, or have boosted the server.\n<#831996541501308939> is unlocked for those who have boosted the server, or are Level 50+.'],
		['How do I get pings for certain things?', 'Visit <#831996509993697310> to edit your ping roles.'],
		['Why is my nickname moderated?', 'Your nickname is moderated because it contains letters and symbols outside of the English language, and can\'t be pinged. If you would like to request a change, please ask a staff member for help.'],
		['How do I level up? How can I check my levels?', 'You can level up by chatting in text channels. Type the command `alevel` in the bot channels to check your current level.'],
		['How do I enter a giveaway?', 'Make sure you have fulfilled the requirement(s) of the giveaway and then react to the giveaway message.'],
	],
	roles: [
		['Staff Roles', '> The roles of staff members in the server. Permissions of these roles cannot be leaked.\n\n> <@&837431445718695938>\n> ➥ Given to staff that have retired\n\n> <@&831996402619777045>\n> ➥ Be level 5, apply, and get accepted\n\n> <@&831996401872535573>\n> ➥ Be promoted from Trainee Moderator\n\n> <@&831996400782016563>\n> ➥ Show exceptional work as a Moderator\n\n> <@&831996399209414697>\n> ➥ Show exceptional work as a Head Moderator\n\n> <@&836583124283686943>\n> ➥ Show exceptional work as an Admin\n\n> <@&831996396684050443>\n> ➥ Co-own the server\n\n> <@&831996396151636029>\n> ➥ Own the server'],
		['Level Roles', '> Each level role is obtainable by levelling to a certain level on the Arcane bot. Check your current level by running the command `arank`.\n\n> <@&831996452758487101>\n> ➥ Reach level 5\n> ✓ Attach images in text channels\n> ✓ Embed links in text channels\n> ✓ Use external emojis in text channels\n> ✓ Can post in <#831996540436086884>\n\n> <@&831996452003643414>\n> ➥ Reach level 10\n> ✓ Add reactions in text channels\n\n> <@&831996451562324068>\n> ➥ Reach level 15\n> ✓ Can use ?afk command\n\n> <@&831996450677325855>\n> ➥ Reach level 20\n> ✓ Can access <#831996527911370852>\n\n> <@&831996449776336947>\n> ➥ Reach level 25\n\n> <@&831996448764985395>\n> ➥ Reach level 30\n\n> <@&831996448282771476>\n> ➥ Reach level 40\n\n> <@&831996447506432020>\n> ➥ Reach level 50\n> ✓ Can post in <#831996541501308939>\n\n> <@&831996446575820851>\n> ➥ Reach level 60\n\n> <@&831996446047469599>\n> ➥ Reach level 70\n\n> <@&831996444516548650>\n> ➥ Reach level 80\n\n> <@&831996444134473768>\n> ➥ Reach level 90\n> ✓ 2x higher XP rate\n\n> <@&831996443401125968>\n> ➥ Reach level 100\n> ✓ Ability to ask for custom role'],
		['Miscellaneous Roles', '> Other roles offered in the server\n\n> <@&831996456717778944>\n> ➥ Vote for our on top.gg (https://top.gg/servers/831995980097388604/vote)\n> ✓ Attach images in text channels\n> ✓ Embed links in text channels\n> ✓ Add reactions in text channels\n> ✓ 5% levelling XP boost\n\n> <@&831996442327515178>\n> ➥ Donate a nitro for a giveaway\n\n> <@&831996441471746099>\n> ➥ Win a giveaway in the server\n\n> <@&831996441132138566>\n> ➥ Win an event in the server\n\n> <@&831996439781179393>\n> ➥ Be a special individual\n\n> <@&831996439260430388>\n> ➥ Role for server owners having over 1,000 members or very well-known people on Discord\n> ✓ Attach images in text channels\n> ✓ Embed links in text channels\n\n> <@&831996437553217547>\n> ➥ Have over 500 subscribers\n> ✓ Allows you to advertise in <#831996540436086884>\n\n> <@&841804547000893490>\n> ➥ Helped develop the bots in this server\n> ✓ Has access to administrative properties on the bots\n\n> <@&831996436794310657>\n> ➥ Given to people that apply and are accepted\n> ✓ Allows you to partner with other servers and post them in <#831996545569652766>\n\n> <@&831996436333592586>\n> ➥ Given to people that have sponsored 5+ giveaways\n> ✓ Allows you to create giveaways in any of the giveaways channel.\n\n> <@&851144985800736788>\n> ➥ Given to people that sponsored 1 no requirement nitro giveaway\n> ✓ Allows you to create giveaways in <#837431285051031572>'],
		['Booster Roles', '> These roles are obtainable by boosting the server.\n\n> <@&836325180842049567>\n> ➥ Boost the server for the following perks\n> ✓ Able to ask for a custom role\n> ✓ Bypass all giveaway requirements\n> ✓ 2x entries in giveaways\n> ✓ 10% higher XP rate on Arcane leveling\n> ✓ Attach images in text channels\n> ✓ Embed links in text channels\n> ✓ Use external emojis in text channels\n> ✓ Ability to change your own nickname\n> ✓ Can access <#831996527911370852>\n> ✓ Can access <#839948450115747880>\n> ✓ Can post in <#831996540436086884>\n> ✓ Can access Exclusive VCs\n> ✓ Can post in <#831996541501308939>\n> ✓ Add 1 emoji of your choice (appropriate)\n\n> <@&831996438716088320>\n> ➥ Boost the server twice or more\n> ✓ All of the perks above\n> ✓ DJ Role (More permissions over <@234395307759108106> bot)\n> ✓ 3x entries in giveaways\n> ✓ 15% higher XP rate on Arcane leveling\n> ✓ Add 1 extra emoji of your choice (appropriate)\n> ✓ Change the username of a staff member for one day (Must be appropriate)'],
	],
};

export const command: Command = {
	name: 'info',
	description: 'Displays server information.',
	category: 'Staff',
	options: [
		{
			type: Options.Subcommand,
			name: 'rules',
			description: 'Displays a server rule.',
			options: [{
				type: Options.Integer,
				name: 'choice',
				description: 'The rule to display.',
				required: true,
				choices: data.rules.map((rule, i) => {
					return {
						name: `${i < 14 ? '' : 'Voice Chat '}Rule ${i < 14 ? i + 1 : i - 13}: ${rule[0]}`,
						value: i,
					};
				}),
			}],
		},
		{
			type: Options.Subcommand,
			name: 'faq',
			description: 'Displays an FAQ entry.',
			options: [{
				type: Options.Integer,
				name: 'choice',
				description: 'The FAQ entry to display.',
				required: true,
				choices: data.faq.map((faq, i) => {
					return {
						name: `FAQ: ${faq[0]}`,
						value: i,
					};
				}),
			}],
		},
		{
			type: Options.Subcommand,
			name: 'roles',
			description: 'Displays information about a set of roles.',
			options: [{
				type: Options.Integer,
				name: 'choice',
				description: 'The set of roles to display information for.',
				required: true,
				choices: data.roles.map((roles, i) => {
					return {
						name: `Role Info: ${roles[0]}`,
						value: i,
					};
				}),
			}],
		},
	],
	async allowed(interaction, client) {
		return (
			(interaction.guild &&
				(interaction.member?.permissions as Readonly<Permissions>)?.has?.(
					'MANAGE_MESSAGES',
				)) ??
			false
		);
	},
	async run(interaction, options, client) {
		const sub = options.getSubcommand(true);
		const choice = options.getInteger('choice', true);
		const prefix = sub === 'rules' ? `${choice < 14 ? '' : 'Voice Chat '}Rule ${choice < 14 ? choice + 1 : choice - 13}` : sub === 'faq' ? 'FAQ' : 'Role Info';
		const embed = new MessageEmbed()
			.setAuthor(`${prefix}: ${data[sub][choice][0]}`, interaction.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setDescription(data[sub][choice][1])
			.setColor('RANDOM')
			.setFooter(`Requested By: ${interaction.user.tag}`);
		interaction.reply({
			embeds: [embed],
		});
	},
};