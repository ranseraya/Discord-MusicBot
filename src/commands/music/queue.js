const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the music queue list.'),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: 'No music is playing or in the queue.', ephemeral: true });
        }

        const tracks = queue.tracks.toArray();
        const currentTrack = queue.currentTrack;

        const queueString = tracks.slice(0, 10).map((song, i) => {
            return `\`${i + 1}.\` [${song.duration}] **${song.title}** -- <@${song.requestedBy.id}>`;
        }).join('\n');

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('📜 Music Queue')
            .setDescription(`**Currently playing:**\n [${currentTrack.duration}] **${currentTrack.title}** -- <@${currentTrack.requestedBy.id}>\n\n**Selanjutnya:**\n${queueString || 'Tidak ada lagu di antrean.'}`)
            .setFooter({ text: `${tracks.length} songs in the queue` });

        await interaction.reply({ embeds: [embed] });
    },
};