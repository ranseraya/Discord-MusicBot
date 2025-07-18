module.exports = async (client, inter) => {
    if (!inter.isCommand()) return;
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

    try {
        await inter.deferReply();
        await command.execute({ inter, client });
    } catch (error) {
        console.error(error);
        await inter.editReply({ content: 'An error occurred while executing this command!', ephemeral: true });
    }
};