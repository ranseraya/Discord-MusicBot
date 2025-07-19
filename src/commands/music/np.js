const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('np')
        .setDescription('Displays the currently playing song.'),
    category: 'music',
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);
        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'No music is playing!', ephemeral: true });
        }

        const track = queue.currentTrack;
        const progressBar = queue.node.createProgressBar();

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎶 Playing now')
            .setDescription(`**[${track.title}](${track.url})**`)
            .setThumbnail(track.thumbnail)
            .addFields(
                { name: 'Song by', value: track.author, inline: true },
                { name: 'Request by', value: `${track.requestedBy.tag}`, inline: true },
                { name: 'Progress', value: progressBar, inline: false }
            );

        return inter.reply({ embeds: [embed] });
    },
};