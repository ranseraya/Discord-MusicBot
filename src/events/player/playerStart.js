const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'playerStart',
    async execute(client, queue, track) {
        if (!queue.metadata) return;

        try {
            const description = `**[${track.title || 'Unknown Title'}](${track.url || '#'})**`;

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('▶️ Start playing')
                .setDescription(description)
                .setThumbnail(track.thumbnail || null)
                .setFooter({
                    text: `Request by: ${track.requestedBy ? track.requestedBy.tag : 'Autoplay'}`
                });

            await queue.metadata.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error("Failed to send request to playerStart:", error);
        }
    },
};