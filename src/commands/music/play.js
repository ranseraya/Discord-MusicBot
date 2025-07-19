const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play songs or playlists from YouTube, Spotify, or SoundCloud.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song title or URL.')
                .setRequired(true)),
    voiceChannel: true,
    async execute({ inter, client }) {
        try {
            if (!inter.member.voice.channel) {
                return inter.reply({ content: "You must be on a voice channel!", flags: [MessageFlags.Ephemeral] });
            }

            await inter.deferReply();

            const query = inter.options.getString('query', true);

            const searchResult = await client.player.search(query, {
                requestedBy: inter.user
            }).catch(e => {
                console.error(`Error while searching for song: ${e}`);
                return null;
            });

            if (!searchResult || !searchResult.hasTracks()) {
                return inter.editReply({ content: `❌ | No results found for \`${query}\`.` });
            }

            await client.player.play(inter.member.voice.channel, searchResult, {
                nodeOptions: {
                    metadata: inter
                }
            });

            const track = searchResult.tracks[0];
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('✅ Added to Queue')
                .setDescription(`**[${track.title}](${track.url})**`)
                .setFooter({ text: `Duration: ${track.duration}` });

            await inter.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("An error occurred in the play command:", error);
            await inter.editReply({ content: '❌ | Sorry, an unexpected error occurred.' });
        }
    },
};