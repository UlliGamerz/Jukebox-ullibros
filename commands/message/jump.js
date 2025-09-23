const { EmbedBuilder } = require('discord.js');
const shiva = require('../../shiva');

const COMMAND_SECURITY_TOKEN = shiva.SECURITY_TOKEN;

module.exports = {
    name: 'jump',
    aliases: ['j', 'skipto', 'goto'],
    description: 'Jump to a specific song in queue',
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
        
        const position = parseInt(args[0]);
        
        if (!position || position < 1) {
            const embed = new EmbedBuilder().setDescription('<a:cross:1420038015123722250> Please provide a valid position number! Example: `!jump 5`');
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

            if (!conditions.hasActivePlayer || conditions.queueLength === 0) {
                const embed = new EmbedBuilder().setDescription('<a:cross:1420038015123722250> Queue is empty!');
                return message.reply({ embeds: [embed] })
                    .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
            }

            if (position > conditions.queueLength) {
                const embed = new EmbedBuilder().setDescription(`<a:cross:1420038015123722250> Invalid position! Queue has only ${conditions.queueLength} songs.`);
                return message.reply({ embeds: [embed] })
                    .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
            }

            const player = conditions.player;
            for (let i = 0; i < position - 1; i++) {
                player.queue.remove(0);
            }

            player.stop();

            const embed = new EmbedBuilder().setDescription(`<a:skip:1420038188533284864> Jumped to position ${position} in queue!`);
            return message.reply({ embeds: [embed] })
                .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));

        } catch (error) {
            console.error('Jump command error:', error);
            const embed = new EmbedBuilder().setDescription('<a:cross:1420038015123722250> An error occurred while jumping in queue!');
            return message.reply({ embeds: [embed] })
                .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
        }
    }
};
