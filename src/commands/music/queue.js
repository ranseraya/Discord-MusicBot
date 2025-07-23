const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays all songs in the queue.'),
    async execute({ inter, client }) {
        const player = inter.client.player;
        const queue = player.nodes.get(inter.guildId);

        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'No music is playing!', ephemeral: true });
        }

        const tracks = queue.tracks.toArray();
        if (tracks.length === 0) {
            return inter.reply({ content: 'No songs in queue.', ephemeral: true });
        }

        const tracksPerPage = 10;
        const totalPages = Math.ceil(tracks.length / tracksPerPage);
        let currentPage = 0;

        const generateEmbed = (page) => {
            const start = page * tracksPerPage;
            const end = start + tracksPerPage;
            const currentTracks = tracks.slice(start, end);

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('📜 Songs queue')
                .setDescription(`**Currently playing:** [${queue.currentTrack.title}](${queue.currentTrack.url})\n\n` +
                    currentTracks.map((track, i) => {
                        return `**${start + i + 1}.** [${track.title}](${track.url}) - \`${track.duration}\``;
                    }).join('\n')
                )
                .setFooter({ text: `Pages ${page + 1} from ${totalPages} | Total ${tracks.length} songs` });

            return embed;
        };

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('⬅️ Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next ➡️')
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
                return i.reply({ content: 'You cannot use this button!', ephemeral: true });
            }

            if (i.customId === 'previous') {
                currentPage--;
            } else if (i.customId === 'next') {
                currentPage++;
            }

            buttons.components[0].setDisabled(currentPage === 0);
            buttons.components[1].setDisabled(currentPage >= totalPages - 1);

            await i.update({
                embeds: [generateEmbed(currentPage)],
                components: [buttons],
            });
        });

        collector.on('end', () => {
            buttons.components.forEach(button => button.setDisabled(true));
            reply.edit({ components: [buttons] });
        });
    },
};