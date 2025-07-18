const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`The bot is ready! Login as${client.user.tag}`);
        client.user.setActivity('Music 🎵');
    },
};