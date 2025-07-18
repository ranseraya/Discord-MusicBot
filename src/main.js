const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
});
client.player.extractors.loadDefault();

// Command Handler
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const files = fs.readdirSync(path.join(commandsPath, folder)).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const command = require(path.join(commandsPath, folder, file));
        if (command.name) {
            client.commands.set(command.name, command);
        }
    }
}

// Event Handler
const eventsPath = path.join(__dirname, 'events', 'Discord');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const eventName = file.split('.')[0];
    const event = require(path.join(eventsPath, file));
    client.on(eventName, event.bind(null, client));
}

client.login(process.env.DISCORD_TOKEN);