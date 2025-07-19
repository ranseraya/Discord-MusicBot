const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes songs from the queue based on their number.')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('song sequence number in the queue')
                .setRequired(true)
                .setMinValue(1)),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);
        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'No music in the queue!', ephemeral: true });
        }

        const trackNumber = inter.options.getInteger('number');

        if (trackNumber === 1) {
            return inter.reply({
                content: '❌ | You cannot delete a song that is currently playing. Use the `/skip` command to skip it..',
                flags: [MessageFlags.Ephemeral]
            });
        }

        const trackToRemove = queue.tracks.toArray()[trackNumber - 1];
        queue.removeTrack(trackToRemove);

        return inter.reply({
            content: `🗑️ | Successfully removed ${trackToRemove.title} from queue.`,
        });
    },
};