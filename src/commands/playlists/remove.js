const { SlashCommandBuilder } = require('discord.js');
const { readPlaylists, savePlaylists } = require('../../utils/playlistManager');
const { success, error } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist-remove')
        .setDescription('Remove song from playlist')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Playlist name.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('The sequence number of the song to be deleted.')
                .setRequired(true)),
    category: 'playlist',
    async execute({ inter }) {
        const playlistName = inter.options.getString('name');
        const trackNumber = inter.options.getInteger('number');
        const userId = inter.user.id;
        const allPlaylists = readPlaylists();

        const userPlaylists = allPlaylists[userId] || [];
        const playlist = userPlaylists.find(p => p.name.toLowerCase() === playlistName.toLowerCase());

        if (!playlist) {
            return inter.reply({ embeds: [error(`Playlist with name "${playlistName}" not found.`)], ephemeral: true });
        }

        if (trackNumber <= 0 || trackNumber > playlist.songs.length) {
            return inter.reply({ embeds: [error(`Invalid song number. Please select a number between 1 and ${playlist.songs.length}.`)], ephemeral: true });
        }

        const removedSong = playlist.songs.splice(trackNumber - 1, 1);
        savePlaylists(allPlaylists);

        return inter.reply({ embeds: [success(`Song **${removedSong[0].title}** has been deleted from playlist **${playlist.name}**.`)], ephemeral: true });
    },
};