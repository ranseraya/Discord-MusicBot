const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute({ inter, client }) {
        await inter.reply({ content: 'Pong!', ephemeral: true });
    },
};