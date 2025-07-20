const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jump')
        .setDescription('Jump to spesific song in queue.')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('The song number in the queue you want to jump.')
                .setRequired(true)
                .setMinValue(1)),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);
        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'No music is playing!', flags: [MessageFlags.Ephemeral] });
        }

        const trackNumber = inter.options.getInteger('number');
        if (trackNumber > queue.tracks.size) {
            return inter.reply({ content: `❌ | Invalid song number. There are only ${queue.tracks.size} next song in the queue.`, flags: [MessageFlags.Ephemeral] });
        }

        const track = queue.tracks.toArray()[trackNumber - 1];
        queue.node.jump(trackNumber - 1);

        return inter.reply({ content: `⏭️ | Successfully jump to song **${track.title}**.` });
    },
};