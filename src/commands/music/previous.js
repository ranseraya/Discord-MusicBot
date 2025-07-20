const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Play the previously played song.'),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);
        if (!queue || !queue.history.previousTrack) {
            return inter.reply({ content: 'There are no previous songs in queue!', flags: [MessageFlags.Ephemeral] });
        }

        await queue.history.back();
        return inter.reply({ content: '⏪ | Play previous song...', ephemeral: true });
    },
};