const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Sets the music repeat mode.')
        .addIntegerOption(option =>
            option.setName('mode')
                .setDescription('Select the loop mode.')
                .setRequired(true)
                .addChoices(
                    { name: '❌ Off', value: 0 },
                    { name: '🔂 Track', value: 1 },
                    { name: '🔁 Queue', value: 2 },
                    { name: '▶️ Autoplay', value: 3 }
                )),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);
        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'There is no music currently playing!', ephemeral: true });
        }

        const loopMode = inter.options.getInteger('mode');
        queue.setRepeatMode(loopMode); 
        const modeName = loopMode === 1 ? 'Track' : loopMode === 2 ? 'Queue' : loopMode === 3 ? 'Autoplay' : 'Off';

        return inter.reply({ content: `✅ | Repeat mode has been set to **${modeName}**.` });
    },
};