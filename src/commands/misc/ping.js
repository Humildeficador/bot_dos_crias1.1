module.exports = {
    name: 'ping',
    description: 'Responde com Pong!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    deleted: true,

    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`)        
    },
};