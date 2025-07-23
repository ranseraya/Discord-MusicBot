const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { readPlaylists } = require('../../utils/playlistManager');
const { error } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist-show')
        .setDescription('Displays all songs in a spesific playlist.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Playlist name you want to display.')
                .setRequired(true)),
    category: 'playlist',
    async execute({ inter }) {
        const playlistName = inter.options.getString('name');
        const userId = inter.user.id;
        const allPlaylists = readPlaylists();

        const userPlaylists = allPlaylists[userId] || [];
        const playlist = userPlaylists.find(p => p.name.toLowerCase() === playlistName.toLowerCase());

        if (!playlist) {
            return inter.reply({ embeds: [error(`Playlist with name "${playlistName}" not found.`)], ephemeral: true });
        }

        if (playlist.songs.length === 0) {
            const emptyEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`🎵 Playlist: ${playlist.name}`)
                .setDescription('Playlist empty.');
            return inter.reply({ embeds: [emptyEmbed], ephemeral: true });
        }

        const tracksPerPage = 10;
        const totalPages = Math.ceil(playlist.songs.length / tracksPerPage);
        let currentPage = 0;

        const generateEmbed = (page) => {
            const start = page * tracksPerPage;
            const end = start + tracksPerPage;
            const currentTracks = playlist.songs.slice(start, end);

            const description = currentTracks
                .map((track, i) => `**${start + i + 1}.** [${track.title}](${track.url})`)
                .join('\n');

            return new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`🎵 Playlist: ${playlist.name}`)
                .setDescription(description)
                .setFooter({ text: `Pages ${page + 1}/${totalPages} | Total ${playlist.songs.length} songs` });
        };

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('⬅️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('➡️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(totalPages <= 1)
        );

        const reply = await inter.reply({
            embeds: [generateEmbed(currentPage)],
            components: [buttons],
            fetchReply: true,
        });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000
        });

        collector.on('collect', async (i) => {
            if (i.user.id !== inter.user.id) {
                return i.reply({ content: "You cannot use this button!", ephemeral: true });
            }

            if (i.customId === 'previous') currentPage--;
            else if (i.customId === 'next') currentPage++;

            buttons.components[0].setDisabled(currentPage === 0);
            buttons.components[1].setDisabled(currentPage >= totalPages - 1);

            await i.update({ embeds: [generateEmbed(currentPage)], components: [buttons] });
        });

        collector.on('end', () => {
            buttons.components.forEach(button => button.setDisabled(true));
            reply.edit({ components: [buttons] }).catch(() => { });
        });
    },
};