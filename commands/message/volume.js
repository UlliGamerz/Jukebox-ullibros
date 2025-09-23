const { EmbedBuilder } = require('discord.js');
const shiva = require('../../shiva');

const COMMAND_SECURITY_TOKEN = shiva.SECURITY_TOKEN;

module.exports = {
    name: 'volume',
    aliases: ['vol', 'v'],
    description: 'Set the music volume (1-100)',
    securityToken: COMMAND_SECURITY_TOKEN,
    
    async execute(message, args, client) {
        if (!shiva || !shiva.validateCore || !shiva.validateCore()) {
            const embed = new EmbedBuilder()
                .setDescription('<a:cross:1420038015123722250> System core offline - Command unavailable')
                .setColor('#FF0000');
            return message.reply({ embeds: [embed] }).catch(() => {});
        }

        message.shivaValidated = true;
        message.securityToken = COMMAND_SECURITY_TOKEN;

        setTimeout(() => {
            message.delete().catch(() => {});
        }, 4000);
        
        const volume = parseInt(args[0]);
        
        if (!volume || volume < 1 || volume > 100) {
            const embed = new EmbedBuilder().setDescription('<a:cross:1420038015123722250> Please provide a valid volume level (1-100)! Example: `!volume 50`');
            return message.reply({ embeds: [embed] })
                .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
        }

        const ConditionChecker = require('../../utils/checks');
        const checker = new ConditionChecker(client);
        
        try {
            const conditions = await checker.checkMusicConditions(
                message.guild.id, 
                message.author.id, 
                message.member.voice?.channelId
            );

            if (!conditions.hasActivePlayer) {
                const embed = new EmbedBuilder().setDescription('<a:cross:1420038015123722250> No music is currently playing!');
                return message.reply({ embeds: [embed] })
                    .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
            }

            if (!conditions.sameVoiceChannel) {
                const embed = new EmbedBuilder().setDescription('<a:cross:1420038015123722250> You need to be in the same voice channel as the bot!');
                return message.reply({ embeds: [embed] })
                    .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
            }

            const player = conditions.player;
            player.setVolume(volume);

            const embed = new EmbedBuilder().setDescription(`<a:audio:1420038003312689224> Volume set to **${volume}%**`);
            return message.reply({ embeds: [embed] })
                .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));

        } catch (error) {
            console.error('Volume command error:', error);
            const embed = new EmbedBuilder().setDescription('<a:cross:1420038015123722250> An error occurred while setting volume!');
            return message.reply({ embeds: [embed] })
                .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
        }
    }
};
