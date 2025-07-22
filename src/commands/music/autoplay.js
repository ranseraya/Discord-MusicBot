const { SlashCommandBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription("Enable or disable autoplay"),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }){
        const queue = client.player.nodes.get(inter.guild);
        if(!queue || !queue.isPlaying()){
            return inter.reply({ content: "No mosic is playing!."});
        }

        const isAutoplay = queue.repeatMode === QueueRepeatMode.AUTOPLAY;

        queue.setRepeatMode(isAutoplay ? QueueRepeatMode.OFF : QueueRepeatMode.AUTOPLAY);

        return inter.reply({ content: `▶️ | Autoplay has ${isAutoplay ? 'disabled' : 'enabled'}.`})
    }
}