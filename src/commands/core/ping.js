const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replay with Pong for testing bot.'),
    async execute(interaction) {
        await interaction.reply(`Pong! 🏓 Latency: ${Date.now() - interaction.createdTimestamp}ms.`);
    },
};