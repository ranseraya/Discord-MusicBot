module.exports = {
    name: 'playerError',
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord-player').GuildQueue} queue
     * @param {Error} error
     */
    async execute(client, queue, error) {
        if (queue) {
            console.log(`[Player Error] An error occurred on the queue server ${queue.guild.name}:`);
        } else {
            console.log(`[Player Error] A general error occurred in the player:`);
        }
        console.error(error.message);
    },
};