const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand())return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

        if (!commandObject) return;

        if (commandObject.devOnly) {
            if (!devs.includes(interaction.member.id)) {
                interaction.replay({
                    content: 'Apenas desenvolvedores podem executar esse comando!',
                    ephemeral: true,
                });
                return; 
            }
        }

        if (commandObject.testOnly) {
            if (!(interaction.guild.id == testServer)) {
                interaction.replay({
                    content: 'Esse comando não pode ser executado aqui!',
                    ephemeral: true,
                });
                return; 
            }   
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permission.has(permission)) {
                    interaction.replay({
                        content: 'Você não tem permissão suficiente!',
                        ephemeral: true,
                    });
                    break;
                }
            }
        }

         if (commandObject.botPermissions?.length) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;

                if (!bot.permissions.has(permission)) {
                    interaction.replay({
                        content: 'Eu não tenho permissão suficiente!',
                        ephemeral: false,
                    });
                    break;
                }
            }
         }

         await commandObject.callback(client, interaction);
    } catch (error) {
        console.log(`Ocorreu um erro ao executar esse comando ${error}`);
    }
};