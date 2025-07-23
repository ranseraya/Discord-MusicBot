const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { readPlaylists, savePlaylists } = require('../../utils/playlistManager');
const { success, error } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist-delete')
        .setDescription('Delete playlist permanently.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Playlist name you want to delete.')
                .setRequired(true)),
    category: 'playlist',
    async execute({ inter }) {
        const playlistName = inter.options.getString('name');
        const userId = inter.user.id;
        const allPlaylists = readPlaylists();

        const userPlaylists = allPlaylists[userId] || [];
        const playlistIndex = userPlaylists.findIndex(p => p.name.toLowerCase() === playlistName.toLowerCase());

        if (playlistIndex === -1) {
            return inter.reply({ embeds: [error(`Playlist with name "${playlistName}" not found.`)], ephemeral: true });
        }

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('confirm_delete')
                .setLabel('Delete')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('cancel_delete')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Secondary)
        );

        const reply = await inter.reply({
            embeds: [error(`Are you sure you want to delete the playlist **${playlistName}**? this action cannot be undone.`)],
            components: [buttons],
            ephemeral: true,
            fetchReply: true,
        });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 15000
        });

        collector.on('collect', async i => {
            if (i.customId === 'confirm_delete') {
                userPlaylists.splice(playlistIndex, 1);
                savePlaylists(allPlaylists);
                await i.update({ embeds: [success(`Playlist **${playlistName}** has been deleted.`)], components: [] });
            } else {
                await i.update({ embeds: [success('Playlist deletion canceled.')], components: [] });
            }
        });

        collector.on('end', (collected) => {
            if (collected.size === 0) {
                reply.edit({ embeds: [error('Confirmation time expired, deletion cancelled.')], components: [] }).catch(() => {});
            }
        });
    },
};