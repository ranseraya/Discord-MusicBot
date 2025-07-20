const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Make bot exit from voice channel.'),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);

        if (queue) {
            queue.delete();
        } else {
            client.player.nodes.delete(inter.guild);
        }

        return inter.reply({ content: "👋 | See you! I have left the vioce channel." });
    },
};