const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'skip',
    description: 'Pular uma musica!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,
    callback: async (client, interaction) => {
        try {
            const channelBot = interaction.guild.members.me.voice.channel;
            const channelMember = interaction.member.voice.channel;
            /* Verifica se o membro está em um canal */
            if (!channelMember) {
                const embed = new EmbedBuilder()
                    .setDescription(`${interaction.user}, você precisa está em um canal de voz para usar esse comando.`)
                    .setColor('Random');
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
                return;
            };

            /* Membro no mesmo canal do bot / Bot não está em um canal */

            if (!channelBot) {
                const embed = new EmbedBuilder()
                    .setDescription(`${interaction.user}, não estou em um canal de voz.`)
                    .setColor('Random');
                await interaction.reply({
                    embeds: [embed], 
                    ephemeral: true,
                });
                return;
            };

            if (channelBot != channelMember) {
                const embed = new EmbedBuilder()
                    .setDescription(`${interaction.user}, você precisa está no mesmo canal de voz que eu para usar esse comando.`)
                    .setColor('Random');
                await interaction.reply({
                    embeds: [embed], 
                    ephemeral: true,
                });
                return;
            };

            /* Cria a fila e a pega a música atual */
            const queue = useQueue(interaction.guild);
            const tracks = queue.tracks.toArray();
            const currentTrack = queue.currentTrack;

            /* Nenhuma música tocando */
            if (queue.node.isIdle()) {
                const embed = new EmbedBuilder()
                    .setDescription(`${interaction.user}, não estou tocando nenhuma música no momento.`)
                    .setColor('Random');
                await interaction.reply({
                    embeds: [embed], 
                    ephemeral: true,
                });
                return;
            };

            /* Nenhuma música na fila */
            if (!tracks[0]) {
                const embed = new EmbedBuilder()
                    .setDescription(`${interaction.user} pulou uma música.\n\n${currentTrack.title} - ${currentTrack.requestedBy}`)
                    .setThumbnail(currentTrack.thumbnail)
                    .setColor('Random');
                await interaction.reply({ embeds: [embed] });
                queue.node.skip();
                return;
            };

            /* Tudo OK */
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user} pulou uma música.\n\n **\`Proxima música:\`**\n[${tracks[0].duration}] - ${tracks[0].title} - ${tracks[0].requestedBy}`)
                .setThumbnail(tracks[0].thumbnail)
                .setColor('Random');

            await interaction.reply({ embeds: [embed] });
            queue.node.skip();

        } catch (error) {
            console.log(`Ocorreu um erro: ${error}`);
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user} Tente novamente em alguns segundos...`)
                .setColor('Random');

            await interaction.reply({
                content: { embeds: [embed] },
                ephemeral: true,
            });
            return;
        };
    },
};