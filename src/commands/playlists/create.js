const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { readPlaylists, savePlaylists } = require('../../utils/playlistManager');
const { success, error } = require("../../utils/embeds");

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

        if (playlistName.length < 3 || playlistName.length > 25) {
            return inter.reply({
                embeds: [error("Playlist names must be between 3 and 25 characters long.")],
                flags: [MessageFlags.Ephemeral]
            });
        }

        const validNameRegex = /^[a-zA-Z0-9_ ]+$/;
        if (!validNameRegex.test(playlistName)) {
            return inter.reply({
                embeds: [error("Playlist names can only contain letters, numbers, spaces and underscores(_)")],
                flags: [MessageFlags.Ephemeral]
            });
        }

        const allPlaylists = readPlaylists();
        if (!allPlaylists[userId]) {
            allPlaylists[userId] = [];
        }

        if (allPlaylists[userId].some(p => p.name.toLowerCase() === playlistName.toLowerCase())) {
            return inter.reply({
                embeds: [error(`You already have a playlist with the name "${playlistName}".`)],
                ephemeral: true
            });
        }

        allPlaylists[userId].push({
            name: playlistName,
            songs: []
        });

        savePlaylists(allPlaylists);

        return inter.reply({
            embeds: [success(`✅ Playlist **${playlistName}** successfully created!`)],
            ephemeral: true
        });
    },
};