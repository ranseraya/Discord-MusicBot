const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the music and clears the queue.'),
    category: 'music',
    djOnly: true,
    voiceChannel: true,
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);

        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'No music is playing!', ephemeral: true });
        }

        queue.delete();

        await inter.reply({ content: '⏹️ | The music has stopped and the queue has been cleared.' });
    },
};