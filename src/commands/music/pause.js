const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'pause',
    description: 'Pausar a musica!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,

    callback: async (client, interaction) => {
        try {
            const channelBot = interaction.guild.members.me.voice.channel;
            const channelMember = interaction.member.voice.channel;
            /* Verificando se está em um canal de voz */
            if (!channelMember) {
                const embed = new EmbedBuilder()
                    .setDescription(`${interaction.user} você precisa está em um canal de voz para usar esse comando.`)
                    .setColor('Random');
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
                return;
            };

            /* Membro no mesmo canal do bot */
            if (channelBot != channelMember){
                const embed = new EmbedBuilder()
                    .setDescription(`${interaction.user} você precisa está no mesmo canal de voz que eu para usar esse comando.`)
                    .setColor('Random');
                await interaction.reply({
                    embeds: [embed], 
                    ephemeral: true,
                });
                return;
            };

            /* Cria a fila e a pega a música atual */
            const queue = useQueue(interaction.guild);

            /* Verifica se está pausado */
            if (queue.node.isIdle() ) {
                const embed = new EmbedBuilder()
                    .setDescription(`${interaction.user} nenhuma música tocando no momento.`)
                    .setColor('Random');
                await interaction.reply({
                    embeds: [embed], 
                    ephemeral: true,
                });
                return;
            } else if (!queue.node.isPlaying()) {
                const embed = new EmbedBuilder()
                    .setDescription(`${interaction.user} a música está pausada..`)
                    .setColor('Random');
                await interaction.reply({
                    embeds: [embed], 
                    ephemeral: true,
                });
                return;
            };

            /* Pega a música atual */
            const currentTrack = queue.currentTrack;

            /* Tudo OK */
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user} pausou a música.\n\n${currentTrack.title} - ${currentTrack.requestedBy}`)
                .setThumbnail(currentTrack.thumbnail)
                .setColor('Random');
            await interaction.reply({ embeds: [embed] });
            queue.node.pause();

        } catch (error) {
            console.log(`Ocorreu um erro ${error}`);
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user} Tente novamente em alguns segundos...`)
                .setColor('Random');
            await interaction.reply({
                content: { embeds: [embed] },
                ephemeral: true,
            });
        };
    },
};