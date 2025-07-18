const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'playerStart',
    execute(queue, track) {
        const interaction = queue.metadata;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `▶️ Start playing`, iconURL: track.requestedBy.displayAvatarURL() })
            .setTitle(`${track.title}`)
            .setURL(track.url)
            .setThumbnail(track.thumbnail)
            .setColor('#13f83e')
            .addFields(
                { name: 'Channel', value: `${queue.channel}`, inline: true },
                { name: 'Duration', value: `\`${track.duration}\``, inline: true }
            )
            .setTimestamp();
        interaction.channel.send({ embeds: [embed] });
    },
};