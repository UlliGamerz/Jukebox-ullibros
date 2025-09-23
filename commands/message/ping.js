const { EmbedBuilder } = require('discord.js');
const shiva = require('../../shiva');

const COMMAND_SECURITY_TOKEN = shiva.SECURITY_TOKEN;

module.exports = {
    name: 'ping',
    description: 'Check the bot\'s latency and uptime',
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

        try {
            const latency = Date.now() - message.createdTimestamp;
            const uptimeSeconds = Math.floor(client.uptime / 1000);
            const hours = Math.floor(uptimeSeconds / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);
            const seconds = uptimeSeconds % 60;

            const embed = new EmbedBuilder()
                .setTitle('📡 Pong!')
                .setColor(0x1DB954)
                .setDescription(
                    `• **Latency:** ${latency} ms\n` +
                    `• **API Ping:** ${Math.round(client.ws.ping)} ms\n` +
                    `• **Uptime:** ${hours}h ${minutes}m ${seconds}s`
                )
                .setTimestamp()
                .setFooter({ text: 'Ultimate Music Bot • Developed by GlaceYT' });

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Ping command error:', error);
            await message.reply('<a:cross:1420038015123722250> An error occurred while checking ping.');
        }
    }
};
