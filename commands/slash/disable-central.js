const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const Server = require('../../models/Server');
const shiva = require('../../shiva');

const COMMAND_SECURITY_TOKEN = shiva.SECURITY_TOKEN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disable-central')
        .setDescription('Disable the central music system')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    securityToken: COMMAND_SECURITY_TOKEN,

    async execute(interaction, client) {
        if (!shiva || !shiva.validateCore || !shiva.validateCore()) {
            const embed = new EmbedBuilder()
                .setDescription('<a:cross:1420038015123722250> System core offline - Command unavailable')
                .setColor('#FF0000');
            return interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
        }

        interaction.shivaValidated = true;
        interaction.securityToken = COMMAND_SECURITY_TOKEN;

        await interaction.deferReply({ ephemeral: true });

        const guildId = interaction.guild.id;

        try {
            const serverConfig = await Server.findById(guildId);
            
            if (!serverConfig?.centralSetup?.enabled) {
                return interaction.editReply({
                    content: '<a:cross:1420038015123722250> Central music system is not currently setup!',
                    ephemeral: true
                });
            }

            try {
                const channel = await client.channels.fetch(serverConfig.centralSetup.channelId);
                const message = await channel.messages.fetch(serverConfig.centralSetup.embedId);
                await message.delete();
            } catch (error) {
                console.log('Central embed already deleted or inaccessible');
            }

            await Server.findByIdAndUpdate(guildId, {
                'centralSetup.enabled': false,
                'centralSetup.channelId': null,
                'centralSetup.embedId': null
            });

            const embed = new EmbedBuilder()
                .setTitle('<a:tick:1420038198989684736> Central Music System Disabled')
                .setDescription('The central music system has been disabled and embed removed.')
                .setColor(0xFF6B6B)
                .setFooter({ text: 'You can re-enable it anytime with /setup-central' });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error disabling central system:', error);
            
            await interaction.editReply({
                content: '<a:cross:1420038015123722250> An error occurred while disabling the central music system!',
                ephemeral: true
            });
        }
    }
};
