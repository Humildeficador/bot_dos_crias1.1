const { ApplicationCommandOptionType  } = require('discord.js');
const { useQueue } = require('discord-player')

module.exports = {
    name: 'loop',
    description: 'Tipos de loop!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,
    options: [
        {
            name: 'tipo',
            description: 'Escolhe os tipos de loop! // 0- Sem loop //1- Loop em uma música // 2- Loop na fila',
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id);
        if(!queue.node.isPlaying()){
            interaction.editReply('Não estou tocando nenhuma música no momento.');
            return;
        }

        let loop = interaction.options.getNumber('tipo');

        if(loop === 0) {
            interaction.editReply(`O ${interaction.user} desativou o loop`);
            queue.setRepeatMode(loop);
            return;
        }

        interaction.editReply(`O ${interaction.user} ativou o loop`)
        console.log(loop)
        queue.setRepeatMode(loop);
    },
};