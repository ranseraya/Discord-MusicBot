const { EmbedBuilder } = require('discord.js');

function success(description) {
    return new EmbedBuilder()
        .setColor(0x57F287)
        .setDescription(description);
}

function error(description) {
    return new EmbedBuilder()
        .setColor(0xED4245)
        .setDescription(`❌ | ${description}`);
}

module.exports = { success, error };