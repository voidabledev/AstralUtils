module.exports = (client) => {
  console.log(`The bot has started, logged in as ${client.user.tag}.`);
  if (client.dev)
    client.user.setPresence({
      status: "dnd",
      activity: {
        name: `with new features`,
        type: "PLAYING",
      },
    });
  else {
    client.randomStatus(client);
    client.setInterval(() => {
      client.randomStatus(client);
    }, 300000);
  }
};
