const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const filters = [
    { name: 'Clear', value: 'clear' },
    { name: 'Bassboost', value: 'bassboost' },
    { name: '8D', value: '8D' },
    { name: 'Nightcore', value: 'nightcore' },
    { name: 'Vaporwave', value: 'vaporwave' },
    { name: 'Reverse', value: 'reverse' },
    { name: 'Surrounding', value: 'surrounding' },
    { name: 'Karaoke', value: 'karaoke' },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('Apply audio filter effects to music.')
        .addStringOption(option =>
            option.setName('effect')
                .setDescription('Select the effect you want to apply')
                .setRequired(true)
                .addChoices(...filters)),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        const queue = client.player.nodes.get(inter.guild);
        if (!queue || !queue.isPlaying()) {
            return inter.reply({ content: 'No music is playing!', ephemeral: true });
        }

        const chosenFilter = inter.options.getString('effect');

        if (chosenFilter === 'clear') {
            await queue.filters.ffmpeg.setFilters(false);
            return inter.reply({ content: '🧼 | All filters have been disable.' });
        }

        await queue.filters.ffmpeg.toggle(chosenFilter);

        const activeFilters = queue.filters.ffmpeg.getFiltersEnabled();

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎧 Filter Audio')
            .setDescription(`Filter ${chosenFilter} have been updated.\nCurrently active filters: ${activeFilters.length ? activeFilters.join(', ') : 'None'}`);

        return inter.reply({ embeds: [embed] });
    },
};