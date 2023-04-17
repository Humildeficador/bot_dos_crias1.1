const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'queue',
    description: 'Mostrar a fila!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild);
        if (!queue) return interaction.editReply('Nenhuma música tocando no momento');
        const tracks = queue.tracks.toArray();
        const currentTrack = queue.currentTrack;

        /* const track = {
            title: tracks[0].title,
            requestedBy: tracks[0].requestedBy,
            duration: tracks[0].duration,
            thumbnail:tracks[0].thumbnail,
        } */
        
        if (!tracks[0]) {
            const embed = new EmbedBuilder()
                .setDescription(`**\`Musica Atual:\n\`**${currentTrack.title} - ${currentTrack.requestedBy}`)
                .setThumbnail(currentTrack.thumbnail)

            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const queueString = tracks.slice(0,10).map((v, i) => {
            return `\`${i + 1}) [${v.duration}]\` ${v.title} - ${v.requestedBy}`;
        }).join('\n');

        const embed = new EmbedBuilder()
            .setDescription(`**\`Musica Atual:\n\`**${currentTrack.title} - ${currentTrack.requestedBy}\n\n **Fila:**\n${queueString}`)
            .setThumbnail(currentTrack.thumbnail)
            .setColor('Random');

        await interaction.editReply({ embeds: [embed] });
        queue.node.resume()
    },
};