const { SlashCommandBuilder } = require('discord.js');
const { readPlaylists } = require('../../utils/playlistManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist-play')
        .setDescription('Plays all songs from your custom playlist.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of the playlist you want to play.')
                .setRequired(true)),
    category: 'playlist',
    voiceChannel: true,
    async execute({ inter, client }) {
        await inter.deferReply();

        const playlistName = inter.options.getString('name');
        const userId = inter.user.id;

        const allPlaylists = readPlaylists();
        const playlist = allPlaylists[userId]?.find(p => p.name.toLowerCase() === playlistName.toLowerCase());

        if (!playlist) {
            return inter.editReply({ content: `Playlist "${playlistName}" not found.` });
        }

        if (playlist.songs.length === 0) {
            return inter.editReply({ content: `Playlist "${playlistName}" empty!` });
        }
        try {
            const queue = client.player.nodes.create(inter.guild, { metadata: inter });
            if (!queue.connection) await queue.connect(inter.member.voice.channel);

            for (const song of playlist.songs) {
                const searchQuery = `${song.title} ${song.author}`;
                const searchResult = await client.player.search(searchQuery, { requestedBy: inter.user });
                if (searchResult.hasTracks()) {
                    queue.addTrack(searchResult.tracks[0]);
                }
            }

            if (!queue.isPlaying()) {
                await queue.node.play();
            }

            return inter.editReply({ content: `▶️ | Playing **${playlist.songs.length} songs** from playlist **${playlist.name}**.` });

        } catch (error) {
            console.error("Error while playing playlist:", error);
            return inter.editReply({ content: '❌ | An error occurred while trying to play the playlist.' });
        }
    },
};