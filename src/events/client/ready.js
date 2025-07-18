const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`✅ Ready! Bot has logged in as ${client.user.tag}`);
        client.user.setActivity('Music | /play');
    },
};