const { Events, Interaction, EmbedBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, inter) {
        if (inter.isChatInputCommand()) {
            await handleSlashCommand(client, inter);
        } else if (inter.isButton()) {
            await handleButton(client, inter);
        }
    },
}

async function handleSlashCommand(client, inter) {
    const command = client.commands.get(inter.commandName);

    if (!command) {
        console.error(`Command "${inter.commandName}" not found.`);
        return inter.reply({ content: 'This command does not exist!', ephemeral: true });
    }

    if (command.voiceChannel) {
        if (!inter.member.voice.channel) {
            return inter.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
        }
        if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) {
            return inter.reply({ content: 'You are not on the same voice channel as me!', ephemeral: true });
        }
    }

    if (command.djOnly) {
        const djRoleName = process.env.DJ_ROLE_NAME || 'DJ';
        const memberRoles = inter.member.roles.cache;
        const memberPermissions = inter.member.permissions;

        const hasPermission = memberPermissions.has('Administrator') || memberRoles.some(role => role.name === djRoleName);

        const isAlone = inter.member.voice.channel.members.size <= 2;

        if (!hasPermission && !isAlone) {
            return inter.reply({
                content: `❌ | This command can only be used by users with the role "${djRoleName}" or if you are alone on the channel.`,
                ephemeral: true
            });
        }
    }

    try {
        await command.execute({ inter, client });
    } catch (error) {
        console.error(error);
        if (inter.replied || inter.deferred) {
            await inter.followUp({ content: 'An error occurred while executing this command!', ephemeral: true });
        } else {
            await inter.reply({ content: 'An error occurred while executing this command!', ephemeral: true });
        }
    }
}

async function handleButton(client, inter) {
    if (!inter.customId.startsWith('control-')) return;
    const queue = client.player.nodes.get(inter.guild);

    await inter.deferReply({ ephemeral: true });

    if (!queue || !queue.isPlaying()) {
        return inter.followUp({ content: 'No music is currently playing.', ephemeral: true });
    }

    if (inter.member.voice.channel?.id !== queue.channel?.id) {
        return inter.followUp({ content: 'You must be on the same voice channel to use these controls!', ephemeral: true });
    }

    let feedback = '';
    switch (inter.customId) {
        case 'control-playpause':
            queue.node.setPaused(!queue.node.isPaused());
            feedback = queue.node.isPaused() ? '⏸️ Music paused.' : '▶️ Music continues.';
            break;
        case 'control-skip':
            queue.node.skip();
            feedback = '⏭️ Song skipped.';
            break;
        case 'control-stop':
            queue.delete();
            feedback = '⏹️ Song stopped.';
            break;
        case 'control-previous':
            if (queue.history.previousTrack) await queue.history.back();
            feedback = '⏮️ Playing previous song.';
            break;
        case 'control-shuffle':
            queue.tracks.shuffle();
            feedback = '🔀 Queue shuffled.';
            break;
        case 'control-loop':
            const newMode = queue.repeatMode === QueueRepeatMode.QUEUE ? QueueRepeatMode.OFF : QueueRepeatMode.QUEUE;
            queue.setRepeatMode(newMode);
            feedback = newMode === QueueRepeatMode.QUEUE ? '🔁 Queue loop enabled.' : '🔁 Loop disabled.';
            break;
        case 'control-queue':
            const nextTracks = queue.tracks.toArray().slice(0, 5).map((track, i) => {
                return `**${i + 1}.** ${track.title}`;
            }).join('\n');

            const queueEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('📜 Next queue')
                .setDescription(nextTracks || 'There is no more song.');

            await inter.editReply({ embeds: [queueEmbed] });
            return;
    }
    await inter.editReply({ content: feedback });
};