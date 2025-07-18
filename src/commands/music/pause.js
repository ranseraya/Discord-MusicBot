const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the currently playing song.'),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: 'No music is playing!', ephemeral: true });
        }

        if (queue.node.isPaused()) {
             return interaction.reply({ content: 'The music is already on pause!', ephemeral: true });
        }

        queue.node.setPaused(true);

        const embed = new EmbedBuilder()
            .setDescription('⏸️ Music has been paused.')
            .setColor('#ffff00');
        await interaction.reply({ embeds: [embed] });
    },
};