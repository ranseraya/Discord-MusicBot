const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows a list of all available commands.'),
    category: 'core',
    async execute({ inter, client }) {
        const commands = client.commands;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Bot Command List LayaMusic')
            .setDescription('Here are all the commands you can use:');

        const commandCategories = {};
        commands.forEach(cmd => {
            const category = cmd.category || 'Others';
            if (!commandCategories[category]) {
                commandCategories[category] = [];
            }
            commandCategories[category].push(`\`/${cmd.data.name}\` - ${cmd.data.description}`);
        });

        for (const category in commandCategories) {
            embed.addFields({ name: `**${category.charAt(0).toUpperCase() + category.slice(1)}**`, value: commandCategories[category].join('\n') });
        }

        await inter.reply({ embeds: [embed], ephemeral: true });
    },
};