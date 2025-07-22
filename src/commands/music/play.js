const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play songs or playlists from YouTube(maintaince), Spotify, etc.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song title or URL.')
                .setRequired(true)),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        try {
            if (!inter.member.voice.channel) {
                return inter.reply({ content: "You must be on the voice channel!", flags: [MessageFlags.Ephemeral] });
            }

            await inter.deferReply();

            const query = inter.options.getString('query', true);

            const searchResult = await client.player.search(query, {
                requestedBy: inter.user,
                // searchEngine: 'auto',
                noCache: true
            });

            if (!searchResult.hasTracks()) {
                return inter.editReply({ content: `❌ | No results found for \`${query}\`.` });
            }

            await client.player.play(inter.member.voice.channel, searchResult, {
                nodeOptions: {
                    metadata: inter
                }
            });

            const embed = new EmbedBuilder()
                .setColor('#0099ff');
            if (searchResult.playlist) {
                embed
                    .setTitle('✅ Playlist Added')
                    .setDescription(`**${searchResult.tracks.length} Songs from playlist [${searchResult.playlist.title}](${searchResult.playlist.url}) have been added to the queue.`);
            } else {
                const track = searchResult.tracks[0];
                embed
                    .setTitle('✅ Added to Queue')
                    .setDescription(`**[${track.title}](${track.url})**`)
                    .setThumbnail(track.thumbnail)
                    .setFooter({ text: `Duration: ${track.duration}` });
            }

            await inter.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("An error occurred in the play command:", error);
            await inter.editReply({ content: '❌ | Sorry, an error occurred while trying to play music.' });
        }
    },
};