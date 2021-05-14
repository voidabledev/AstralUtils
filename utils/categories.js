exports.valid = [
  "Moderation",
  "Information",
  "Giveaways",
  "Administration",
  "Misc",
];
exports.validate = (command, valid) => {
  if (command.help.hidden) return "";
  if (!command.help.category || !valid.includes(command.help.category))
    return "Misc";
  return command.help.category;
};

exports.validateInput = (input, valid) => {
  if (
    valid.includes(
      `${input.charAt(0).toUpperCase()}${input.slice(1).toLowerCase()}`
    )
  )
    return `${input.charAt(0).toUpperCase()}${input.slice(1).toLowerCase()}`;
  else return "";
};
