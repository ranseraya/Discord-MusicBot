const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the current song.'),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);

        if (!queue) {
            return inter.reply({ content: 'There is no music in the queue!', ephemeral: true });
        }

        if (!queue.node.isPaused()) {
             return inter.reply({ content: 'Music is not paused!', ephemeral: true });
        }

        const success = queue.node.resume();

        return inter.reply({
            content: success ? '▶️ | The music has resumed.' : '❌ | Failed to continue music.',
            ephemeral: true
        });
    },
};