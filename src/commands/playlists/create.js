const { SlashCommandBuilder } = require('discord.js');
const { readPlaylists, savePlaylists } = require('../../utils/playlistManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist-create')
        .setDescription('Create new custom playlist.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name for your new playlist.')
                .setRequired(true)),
    category: 'playlist',
    async execute({ inter }) {
        const playlistName = inter.options.getString('name');
        const userId = inter.user.id;

        const allPlaylists = readPlaylists();
        if (!allPlaylists[userId]) {
            allPlaylists[userId] = [];
        }

        if (allPlaylists[userId].some(p => p.name.toLowerCase() === playlistName.toLowerCase())) {
            return inter.reply({ content: `You already have a playlist with the name "${playlistName}".`, ephemeral: true });
        }

        allPlaylists[userId].push({
            name: playlistName,
            songs: []
        });

        savePlaylists(allPlaylists);

        return inter.reply({ content: `✅ | Playlist **${playlistName}** successfully created!` });
    },
};