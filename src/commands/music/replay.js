const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Repeat the currently playing song from the beginning.'),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);
        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'No music is playing!', flags: [MessageFlags.Ephemeral] });
        }

        await queue.node.seek(0);

        return inter.reply({ content: '🔄 | The current song has been repeated.' });
    },
};