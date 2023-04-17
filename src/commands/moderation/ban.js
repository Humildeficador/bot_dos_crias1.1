const { ApplicationCommandOptionType, PermissionFlagsBits  } = require('discord.js')

module.exports = {
    name: 'ban',
    description: 'Baniu um membro!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    deleted: true,
    options: [
        {
            name: 'usuario-alvo',
            description: 'O usuário que você quer banir.',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'razao',
            description: 'Razão do banimento',
            type: ApplicationCommandOptionType.String,
        },
    ],
    PermissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: (client, interaction) => {
        interaction.reply(`Banido..`)
    },
};