const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'playerStart',
    async execute(client, queue, track) {
        if (!queue.metadata || !queue.metadata.channel) return;

        const previousButton = new ButtonBuilder()
            .setCustomId('control-previous')
            .setLabel('⏮️ Previous')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(!queue.history.previousTrack);

        const playPauseButton = new ButtonBuilder()
            .setCustomId('control-playpause')
            .setLabel(queue.node.isPaused() ? '▶️ Resume' : '⏸️ Pause')
            .setStyle(queue.node.isPaused() ? ButtonStyle.Success : ButtonStyle.Secondary);

        const skipButton = new ButtonBuilder()
            .setCustomId('control-skip')
            .setLabel('⏭️ Skip')
            .setStyle(ButtonStyle.Secondary);

        const stopButton = new ButtonBuilder()
            .setCustomId('control-stop')
            .setLabel('⏹️ Stop')
            .setStyle(ButtonStyle.Danger);

        const loopButton = new ButtonBuilder()
            .setCustomId('control-loop')
            .setLabel('🔁 Loop')
            .setStyle(ButtonStyle.Secondary);

        const shuffleButton = new ButtonBuilder()
            .setCustomId('control-shuffle')
            .setLabel('🔀 Shuffle')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(queue.tracks.size < 2);

        const queueButton = new ButtonBuilder()
            .setCustomId('control-queue')
            .setLabel('📜 Queue')
            .setStyle(ButtonStyle.Primary);

        const row1 = new ActionRowBuilder().addComponents(previousButton, playPauseButton, skipButton, stopButton, queueButton);
        const row2 = new ActionRowBuilder().addComponents(loopButton, shuffleButton);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('▶️ Start playing')
            .setDescription(`**[${track.title || 'Unknown Title'}]**`)
            .setThumbnail(track.thumbnail || null)
            .addFields(
                { name: 'Song by', value: track.author, inline: true },
            )
            .setFooter({
                text: `Request by: ${track.requestedBy ? track.requestedBy.tag : 'Autoplay'}`
            });

        try {
            await queue.metadata.channel.send({ embeds: [embed], components: [row1, row2] });
        } catch (error) {
            console.error("Failed to send request to playerStart:", error);
        }
    },
};