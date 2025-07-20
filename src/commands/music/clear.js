const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Remove all songs from the queue.'),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);

        if (!queue || !queue.tracks.size) {
            return inter.reply({
                content: 'There are no songs in the queue to delete.!',
                flags: [MessageFlags.Ephemeral]
            });
        }

        const tracksCount = queue.tracks.size;

        queue.tracks.clear();

        return inter.reply({ content: `✅ | Successfully removed **${tracksCount}** songs from queue.` });
    },
};