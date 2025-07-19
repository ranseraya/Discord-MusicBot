const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Adjust the music player volume.')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Volume level (0-100).')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(100)),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);
        if (!queue) {
            return inter.reply({ content: 'No music is playing!', ephemeral: true });
        }

        const volume = inter.options.getInteger('level');
        const success = queue.node.setVolume(volume);

        return inter.reply({
            content: success ? `🔊 | Volume has been set to ${volume}%.` : '❌ | Failed to change volume!',
            ephemeral: true
        });
    },
};