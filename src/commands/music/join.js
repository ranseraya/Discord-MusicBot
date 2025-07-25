const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Joins the voice channel.'),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        try {
            if (!inter.member.voice.channel) {
                return inter.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
            }
            const queue = client.player.nodes.create(inter.guild, {
                metadata: {
                    channel: inter.channel,
                    client: inter.guild.members.me,
                    requestedBy: inter.user,
                },
                selfDeaf: true,
                volume: 80,
                leaveOnEmpty: true,
                leaveOnEnd: true,
            });

            if (!queue.connection) await queue.connect(inter.member.voice.channel);

            await inter.reply({ content: `Joined **${inter.member.voice.channel.name}**! 🎶`, ephemeral: true });
        } catch (error) {
            console.error("An error occurred in the join command:", error);
            await inter.editReply({ content: '❌ | Sorry, an error occurred while trying to join the channel..' });
        }
    },
};