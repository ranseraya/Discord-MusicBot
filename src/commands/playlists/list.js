const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { readPlaylists } = require('../../utils/playlistManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist-list')
        .setDescription('Displays all your custom playlists.'),
    category: 'playlist',
    async execute({ inter }) {
        const userId = inter.user.id;
        const allPlaylists = readPlaylists();
        const userPlaylists = allPlaylists[userId] || [];

        if (userPlaylists.length === 0) {
            return inter.reply({ content: "You don't have any playlist.", ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${inter.user.username}'s Playlists`)
            .setDescription(userPlaylists.map((p, i) => `**${i + 1}.** ${p.name} (${p.songs.length} songs)`).join('\n'));

        return inter.reply({ embeds: [embed], ephemeral: true });
    },
};