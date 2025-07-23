const { SlashCommandBuilder } = require('discord.js');
const { readPlaylists, savePlaylists } = require('../../utils/playlistManager');
const { success, error } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist-edit')
        .setDescription('Modifi existing playlist name.')
        .addStringOption(option =>
            option.setName('old_name')
                .setDescription('Current playlist name.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('new_name')
                .setDescription('New name for playlist.')
                .setRequired(true)),
    category: 'playlist',
    async execute({ inter }) {
        const oldName = inter.options.getString('old_name');
        const newName = inter.options.getString('new_name');
        const userId = inter.user.id;
        const allPlaylists = readPlaylists();

        if (newName.length < 3 || newName.length > 25) {
            return inter.reply({ embeds: [error("New playlist names must be between 3 and 25 characters.")], ephemeral: true });
        }
        const validNameRegex = /^[a-zA-Z0-9_ ]+$/;
        if (!validNameRegex.test(newName)) {
            return inter.reply({ embeds: [error("New playlist names can only contain letters, numbers, spaces, and underscores (_).")], ephemeral: true });
        }

        const userPlaylists = allPlaylists[userId] || [];
        const playlist = userPlaylists.find(p => p.name.toLowerCase() === oldName.toLowerCase());

        if (!playlist) {
            return inter.reply({ embeds: [error(`Playlist with name "${oldName}" not found.`)], ephemeral: true });
        }

        if (userPlaylists.some(p => p.name.toLowerCase() === newName.toLowerCase())) {
            return inter.reply({ embeds: [error(`You already have a playlist with the name "${newName}".`)], ephemeral: true });
        }

        playlist.name = newName;
        savePlaylists(allPlaylists);

        return inter.reply({ embeds: [success(`Playlist name **${oldName}** has been change to  **${newName}**.`)] , ephemeral: true});
    },
};