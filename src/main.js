const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

(async () => {
    client.player = new Player(client, {
        ytdlOptions: {
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        }
    });
    await client.player.extractors.loadMulti(DefaultExtractors);

    // Command Handler
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {
        const files = fs.readdirSync(path.join(commandsPath, folder)).filter(file => file.endsWith('.js'));
        for (const file of files) {
            const command = require(path.join(commandsPath, folder, file));
            if (command.data && command.data.name) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] Command in ${path.join(commandsPath, folder, file)} does not have property 'data' or 'data.name'.`);
            }
        }
    }

    // Event Handler
    const eventsPath = path.join(__dirname, 'events');
    const eventFolders = fs.readdirSync(eventsPath);

    for (const folder of eventFolders) {
        const eventFiles = fs.readdirSync(path.join(eventsPath, folder)).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, folder, file);
            const event = require(filePath);

            if (event.name && event.execute) {
                const source = folder === 'player' ? client.player.events : client;

                if (event.once) {
                    source.once(event.name, (...args) => event.execute(client, ...args));
                } else {
                    source.on(event.name, (...args) => event.execute(client, ...args));
                }
            }
        }
    }

    client.login(process.env.DISCORD_TOKEN);
})();