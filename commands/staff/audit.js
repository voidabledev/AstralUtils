/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
module.exports = {
	help: {
		name: 'audit',
		description: 'Displays the last 15 actions of the audit log',
		usage: 'Empty',
		aliases: alias.staff.audit,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 0,
		maxArgs: null,
		userPerms: ['VIEW_AUDIT_LOG'],
		botPerms: ['VIEW_AUDIT_LOG'],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		// Code here
	},
};