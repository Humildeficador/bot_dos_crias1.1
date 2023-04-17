const { useQueue, useHistory } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'previous',
    description: 'Voltar uma musica!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,

    callback: async (client, interaction) => {

        await interaction.deferReply();

        const queue = useQueue(interaction.guild);
        if (!queue) return interaction.editReply('Nenhuma música tocando no momento');
        const history = useHistory(interaction.guild.id);
        await history.previous();
        const currentTrack = queue.currentTrack;

        const embed = new EmbedBuilder()
            .setDescription(`${interaction.user} voltou uma música.\n\n**\`Musica Atual:\n\`**${currentTrack.title} - ${currentTrack.requestedBy}`)
            .setThumbnail(currentTrack.thumbnail)
            .setColor('Random');

        await interaction.editReply({ embeds: [embed] });
        
    },
};