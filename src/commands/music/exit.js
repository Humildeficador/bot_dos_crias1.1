const { useQueue } = require('discord-player');

module.exports = {
    name: 'exit',
    description: 'Sair do canal!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,

    callback: async (client, interaction) => {
        await interaction.deferReply();

        /* const queue = client.player.nodes.create(interaction.guild); */
        const queue = useQueue(interaction.guild);
        await interaction.editReply(`${interaction.user} por que você me odeia? 😥`);
        queue.delete();
    },
};