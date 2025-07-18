module.exports = {
    name: 'error',
    execute(queue, error) {
        console.log(`[Player Error] An error occurred on the queue server ${queue.guild.name}:`);
        console.log(error);

        const interaction = queue.metadata;
        if (interaction && interaction.channel) {
            interaction.channel.send(`❌ An error occurred in the music player: ${error.message}`);
        }
    },
};