const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the music queue.'),
    async execute({ inter, client }) {
        // Gunakan 'inter'
        const queue = client.player.nodes.get(inter.guild);

        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'There is no music in the queue!', ephemeral: true });
        }

        const tracks = queue.tracks.map((track, i) => {
            return `**${i + 1}.** [${track.title}](${track.url}) - ${track.requestedBy.tag}`;
        });

        const nowPlaying = `**Currently playing:**\n[${queue.currentTrack.title}](${queue.currentTrack.url}) - ${queue.currentTrack.requestedBy.tag}`;
        const tracksMessage = tracks.length > 0 ? tracks.slice(0, 10).join('\n') : 'There is no next song.';

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Music Queue')
            .setDescription(`${nowPlaying}\n\n**Next:**\n${tracksMessage}`)
            .setFooter({ text: `Total ${queue.tracks.size} songs in queue.` });

        return inter.reply({ embeds: [embed] });
    },
};