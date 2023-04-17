module.exports = {
    name: 'ping',
    description: 'Responde com Pong!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,
    //options: 

    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`)
    },
};