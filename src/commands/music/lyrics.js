const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Displays the lyrics of the song currently playing or the song being searched for.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title of the song you want search for lyrics (optional).')
                .setRequired(false)),
    category: 'music',
    voiceChannel: true,
    async execute({ inter, client }) {
        await inter.deferReply();

        const queue = client.player.nodes.get(inter.guild);
        const query = inter.options.getString('title');

        let track;

        try {
            if (query) {
                const result = await client.player.search(query, { requestedBy: inter.user });
                if (!result.hasTracks()) {
                    return inter.editReply({ content: `❌ | Song with title "${query}" not found.` });
                }
                track = result.tracks[0];
            } else if (queue && queue.currentTrack) {
                track = queue.currentTrack;
            } else {
                return inter.editReply({ content: 'No song is playing or song title is not given!' });
            }

            const results = await client.player.lyrics.search({
                q: `${track.title} ${track.author}`
            });

            const lyrics = results?.[0];

            if (!lyrics || !lyrics.plainLyrics) {
                return inter.editReply({ content: `❌ | Lyrics not found for song **${track.title}**.` });
            }

            const trimmedLyrics = lyrics.plainLyrics.length > 4096 ? lyrics.plainLyrics.substring(0, 4093) + '...' : lyrics.plainLyrics;

            const embed = new EmbedBuilder()
                .setTitle(`🎶 Lyrics for ${track.title}`)
                .setURL(lyrics.url)
                .setThumbnail(track.thumbnail)
                .setAuthor({ name: lyrics.artistName })
                .setDescription(trimmedLyrics)
                .setColor('#0099ff');

            return inter.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("Error while searching for lyrics:", error);
            return inter.editReply({ content: '❌ | An error accorred while trying to searching for lyrics.' });
        }
    },
};