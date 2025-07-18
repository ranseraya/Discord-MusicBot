const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from YouTube, Spotify, or SoundCloud.')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The name or URL of the song.')
                .setRequired(true)),
    voiceChannel: true,
    async execute({ inter, client }) {
        if (!inter.member.voice.channel) {
            return inter.reply({ content: "You must be on the voice channel!", ephemeral: true });
        }

        await inter.deferReply();

        const songName = inter.options.getString('song');
        const queue = client.player.nodes.create(inter.guild, {
            metadata: {
                channel: inter.channel,
                client: inter.guild.members.me,
                requestedBy: inter.user
            },
            selfDeaf: true,
            volume: 80,
        });

        if (!queue.connection) await queue.connect(inter.member.voice.channel);

        try {
            const result = await client.player.search(songName, {
                requestedBy: inter.user
            });

            if (!result || !result.tracks.length) {
                return inter.editReply({ content: `❌ | Song **${songName}** not found!` });
            }

            queue.addTrack(result.tracks[0]);
            if (!queue.isPlaying()) await queue.node.play();

            await inter.editReply({ content: `✅ | Adding **${result.tracks[0].title}** to the queue.` });

        } catch (error) {
            console.error(error);
            await inter.editReply({ content: 'An error occurred while playing the song!', ephemeral: true });
        }
    },
};