const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'skip',
    description: 'Pular uma musica!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,

    callback: async (client, interaction) => {

        await interaction.deferReply();

        const queue = useQueue(interaction.guild);
        if (!queue) return interaction.editReply('Nenhuma música tocando no momento');
        const tracks = queue.tracks.toArray();

        const embed = new EmbedBuilder()
            .setDescription(`${interaction.user} pulou uma música.\n\n \`Proxima música:\`\n **${tracks[0].duration} - ${tracks[0].title} - ${tracks[0].requestedBy}`)
            .setThumbnail(tracks[0].thumbnail)
            .setColor('Random');

        await interaction.editReply({ embeds: [embed] });
        queue.node.skip();
    },
};