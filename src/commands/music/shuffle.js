const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Randomizes the order of songs in the queue.'),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);
        if (!queue || queue.tracks.size < 2) {
            return inter.reply({ content: 'There are not enough songs in the queue to shuffle!', ephemeral: true });
        }

        queue.tracks.shuffle();

        return inter.reply({ content: '🔀 | The queue has been successfully randomized.' });
    },
};