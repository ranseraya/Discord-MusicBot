const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused song.'),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return interaction.reply({ content: 'No music to continue!', ephemeral: true });
        }

        if (!queue.node.isPaused()) {
            return interaction.reply({ content: 'Music is not paused!', ephemeral: true });
        }

        queue.node.setPaused(false);

        const embed = new EmbedBuilder()
            .setDescription('▶️ The music continues.')
            .setColor('#13f83e');

        await interaction.reply({ embeds: [embed] });
    },
};