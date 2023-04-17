const { useQueue } = require('discord-player');

module.exports = {
    name: 'pause',
    description: 'Pausar a musica!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,

    callback: async (client, interaction) => {
        await interaction.deferReply();

        /* const queue = client.player.nodes.create(interaction.guild); */
        const queue = useQueue(interaction.guild);
        await interaction.editReply(`O ${interaction.user} pausou a música \n${queue.currentTrack}`)
        queue.node.pause()
    },
};