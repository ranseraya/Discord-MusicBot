const { SlashCommandBuilder } = require('discord.js');
const { readPlaylists, savePlaylists } = require('../../utils/playlistManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist-add')
        .setDescription('Add songs to your custom playlist.')
        .addStringOption(option =>
            option.setName('playlist')
                .setDescription('The name of the destination playlist.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The URL of the song you want to add.')
                .setRequired(true)),
    category: 'playlist',
    async execute({ inter, client }) {
        await inter.deferReply({ ephemeral: true });

        const playlistName = inter.options.getString('playlist');
        const songQuery = inter.options.getString('song');
        const userId = inter.user.id;

        const allPlaylists = readPlaylists();

        if (!allPlaylists[userId]) {
            return inter.editReply({ content: "You don't have any playlist yet. Create playlist with `/playlist-create`." });
        }

        const playlist = allPlaylists[userId].find(p => p.name.toLowerCase() === playlistName.toLowerCase());

        if (!playlist) {
            return inter.editReply({ content: `Playlist with name "${playlistName}" not found.` });
        }

        const searchResult = await client.player.search(songQuery, { requestedBy: inter.user });

        if (searchResult.playlist) {
            const tracksToAdd = searchResult.tracks.map(track => ({
                title: track.title,
                url: track.url
            }));
            playlist.songs.push(...tracksToAdd);
            savePlaylists(allPlaylists);

            return inter.editReply({ content: `✅ | Successfully added **${tracksToAdd.length} song** from playlist **${searchResult.playlist.title}** to **${playlist.name}**.` });
        } else {
            const track = searchResult.tracks[0];
            playlist.songs.push({
                title: track.title,
                url: track.url
            });
        }

        savePlaylists(allPlaylists);

        return inter.editReply({ content: `✅ | **${track.title}** has been added to the playlist **${playlist.name}**.` });
    },
};