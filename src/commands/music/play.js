const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play songs or playlists from YouTube, Spotify, or SoundCloud.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song title or URL.')
                .setRequired(true)),
    async execute(interaction) {
        const player = useMainPlayer();

        const channel = interaction.member.voice.channel;
        if (!channel) {
            return interaction.reply({ content: 'You must be on a voice channel to play music!', ephemeral: true });
        }

        await interaction.deferReply();

        const query = interaction.options.getString('query', true);

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction
                }
            });

            const embed = new EmbedBuilder()
                .setTitle("✅ Added to Queue")
                .setDescription(`**[${track.title}](${track.url})**`)
                .setThumbnail(track.thumbnail)
                .setColor('#2f3136')
                .setFooter({ text: `Duration: ${track.duration}` });
            return interaction.followUp({ embeds: [embed] });

        } catch (e) {
            console.error(e);
            return interaction.followUp({ content: `❌ There is an error: ${e.message}` });
        }
    },
};