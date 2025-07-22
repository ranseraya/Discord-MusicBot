const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song.'),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);

        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'No music is playing!', ephemeral: true });
        }

        if (queue.node.isPaused()) {
             return inter.reply({ content: 'The music is already on pause!', ephemeral: true });
        }

        const success = queue.node.pause();

        return inter.reply({
            content: success ? '⏸️ | Music has been paused.' : '❌ | Failed to pause music.',
            ephemeral: true
        });
    },
};