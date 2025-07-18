const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song.'),
    voiceChannel: true,
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);

        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'No music is playing!', ephemeral: true });
        }

        const success = queue.node.skip();

        return inter.reply({
            content: success ? `⏭️ | Song **${queue.currentTrack.title}** has been passed.` : '❌ | Failed to skip the song.',
            ephemeral: true
        });
    },
};