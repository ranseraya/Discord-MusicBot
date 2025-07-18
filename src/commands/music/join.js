const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Make bots join your voice channel.'),
    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply({ content: 'You have to be on a voice channel first!', ephemeral: true });
        }

        if (interaction.guild.members.me.voice.channel) {
             return interaction.reply({ content: "I'm already on a voice channel!", ephemeral: true });
        }

        try {
            player.nodes.create(interaction.guild, {
                metadata: interaction.channel,
                selfDeaf: true,
                volume: 80,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 300000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 300000,
            }).connect(channel);

            const embed = new EmbedBuilder()
                .setDescription(`✅ Successfully joined the channel: ${channel.name}!`)
                .setColor('#2f3136');

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Failed to join voice channel.', ephemeral: true });
        }
    },
};