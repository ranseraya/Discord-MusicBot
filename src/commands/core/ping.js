const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Checking bot latency and replying with Pong!'),
    category: 'core',
    async execute({ inter, client }) {
        const sent = await inter.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });
        const roundtripLatency = sent.createdTimestamp - inter.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Latensi Bot (Roundtrip)', value: `\`${roundtripLatency}ms\``, inline: true },
                { name: 'Latensi API (WebSocket)', value: `\`${apiLatency}ms\``, inline: true }
            );

        await inter.editReply({ content: '', embeds: [embed] });
    },
};