const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music, clear the queue, and exit.'),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return interaction.reply({ content: 'There is no music that needs to be stopped.', ephemeral: true });
        }

        queue.delete();

        const embed = new EmbedBuilder()
            .setDescription('⏹️ The music has stopped and the queue has been cleared.')
            .setColor('#ff0000');

        await interaction.reply({ embeds: [embed] });
    },
};