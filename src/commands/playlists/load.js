const { SlashCommandBuilder } = require('discord.js');
const { readPlaylists } = require('../../utils/playlistManager');
const { success, error } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist-load')
        .setDescription('Load all songs from playlist into queue.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Playlist name you want to load.')
                .setRequired(true)),
    category: 'playlist',
    async execute({ inter, client }) {
        const memberVC = inter.member.voice.channel;
        if (!memberVC) {
            return inter.reply({ embeds: [error('You must be in a voice channel to load a playlist!')], ephemeral: true });
        }

        const playlistName = inter.options.getString('name');
        const userId = inter.user.id;
        const allPlaylists = readPlaylists();

        const userPlaylists = allPlaylists[userId] || [];
        const playlist = userPlaylists.find(p => p.name.toLowerCase() === playlistName.toLowerCase());

        if (!playlist) {
            return inter.reply({ embeds: [error(`Playlist with name "${playlistName}" not found.`)], ephemeral: true });
        }
        if (playlist.songs.length === 0) {
            return inter.reply({ embeds: [error('Playlist empty, no songs to load.')], ephemeral: true });
        }

        const player = client.player;
        const queue = player.nodes.get(inter.guildId) || player.nodes.create(inter.guildId, {
            metadata: {
                channel: inter.channel,
                client: inter.guild.members.me,
                requestedBy: inter.user,
            },
            selfDeaf: true,
            volume: 80,
            leaveOnEmpty: true,
            leaveOnEnd: true,
        });

        try {
            if (!queue.connection) await queue.connect(memberVC);
        } catch {
            player.nodes.delete(inter.guildId);
            return inter.reply({ embeds: [error('Unable to join voice channel!')], ephemeral: true });
        }

        await inter.deferReply();

        const trackList = await Promise.all(playlist.songs.map(song => player.search(song.url, { requestedBy: inter.user })));
        const tracksToAdd = trackList.flatMap(searchResult => searchResult.tracks).filter(Boolean);

        if (tracksToAdd.length === 0) {
            return inter.followUp({ embeds: [error(`Could not find valid songs from playlist **${playlist.name}**.`)] });
        }

        queue.addTrack(tracksToAdd);

        if (!queue.isPlaying()) {
            await queue.node.play();
        }

        return inter.followUp({ embeds: [success(`✅ Successfully load **${tracksToAdd.length} songs** from playlist **${playlist.name}**.`)] });
    },
};