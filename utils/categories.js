exports.valid = ["Moderation", "Information", "Misc"];

exports.validate = (command, valid) => {
  if (command.help.hidden) return ""; // i'm changing the modlogs, also can you implement modlogs on >nick?
  if (!command.help.category || !valid.includes(command.help.category))
    //
    // check discord pls
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
