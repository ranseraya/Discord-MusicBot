const { SlashCommandBuilder } = require('discord.js');
const { readPlaylists, savePlaylists } = require('../../utils/playlistManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist-add')
        .setDescription('Add songs or playlists to your custom playlist.')
        .addStringOption(option =>
            option.setName('playlist')
                .setDescription('Destination playlist name.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('query')
                .setDescription('URL of the song or playlist you want to add.')
                .setRequired(true)),
    category: 'playlist',
    async execute({ inter, client }) {
        await inter.deferReply({ ephemeral: true });

        const playlistName = inter.options.getString('playlist');
        const query = inter.options.getString('query');
        const userId = inter.user.id;

        const allPlaylists = readPlaylists();
        if (!allPlaylists[userId]) {
            return inter.editReply({ content: "You don't have any playlists yet." });
        }
        const playlist = allPlaylists[userId].find(p => p.name.toLowerCase() === playlistName.toLowerCase());
        if (!playlist) {
            return inter.editReply({ content: `Playlist "${playlistName}" not found.` });
        }

        const searchResult = await client.player.search(query, { requestedBy: inter.user });
        if (!searchResult.hasTracks()) {
            return inter.editReply({ content: `No results found for "${query}".` });
        }

        const tracksToAdd = searchResult.tracks.map(track => ({
            title: track.title,
            url: track.url,
            author: track.author
        }));

        playlist.songs.push(...tracksToAdd);
        savePlaylists(allPlaylists);

        if (searchResult.playlist) {
            return inter.editReply({ content: `✅ | successflly added **${tracksToAdd.length} songs** from **${searchResult.playlist.title}** to playlist **${playlist.name}**.` });
        } else {
            return inter.editReply({ content: `✅ | **${tracksToAdd[0].title}** has been added to playlist **${playlist.name}**.` });
        }
    },
};