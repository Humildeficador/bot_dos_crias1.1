const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'queue',
    description: 'Mostrar a fila!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,

    callback: async (client, interaction) => {
        try {
            /* Nenhuma música tocando */
            const queue = useQueue(interaction.guild);
            if ((!queue) || queue.node.isIdle() && !queue.node.isBuffering() ) {
                interaction.reply({
                    content: 'Não estou tocando nenhuma música no momento.',
                    ephemeral: true,
                });
                return;
            }
            const tracks = queue.tracks.toArray();
            const currentTrack = queue.currentTrack;

            /* Nenhuma música na fila */
            if (!tracks[0]) {
                const embed = new EmbedBuilder()
                    .setDescription(`**\`Musica Atual:\n\`**${currentTrack.title} - ${currentTrack.requestedBy}`)
                    .setThumbnail(currentTrack.thumbnail)
                    .setColor('Random');

                await interaction.reply({ embeds: [embed] });
                return;
            };

            /* String com as músicas da fila */
            const queueString = tracks.slice(0, 10).map((v, i) => {
                return `\`${i + 1}) [${v.duration}]\` ${v.title} - ${v.requestedBy}`;
            }).join('\n');

            /* Tudo OK */
            const embed = new EmbedBuilder()
                .setDescription(`**\`Musica Atual:\n\`**${currentTrack.title} - ${currentTrack.requestedBy}\n\n **Fila:**\n${queueString}`)
                .setThumbnail(currentTrack.thumbnail)
                .setColor('Random');

            await interaction.reply({ embeds: [embed] });
            queue.node.resume();

        } catch (error) {
            console.log(`Ocorreu um erro ${error}`);
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user} Tente novamente em alguns segundos...`)
                .setColor('Random');
            await interaction.reply({
                content: { embeds: [embed] },
                ephemeral: true,
            });
        }
    },
};