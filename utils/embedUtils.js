const { EmbedBuilder } = require('discord.js');
const config = require('../config');

class EmbedUtils {
    static createSuccessEmbed(title, description) {
        return new EmbedBuilder()
            .setTitle(`<a:tick:1420038198989684736> ${title}`)
            .setDescription(description)
            .setColor(0x00FF00)
            .setTimestamp();
    }
    
    static createErrorEmbed(title, description) {
        return new EmbedBuilder()
            .setTitle(`<a:cross:1420038015123722250> ${title}`)
            .setDescription(description)
            .setColor(0xFF0000)
            .setTimestamp();
    }
    
    static createMusicEmbed(title, description) {
        return new EmbedBuilder()
            .setTitle(`<a:disc:1420038026624499733> ${title}`)
            .setDescription(description)
            .setColor(config.bot.embedColor)
            .setTimestamp();
    }
}

module.exports = EmbedUtils;
