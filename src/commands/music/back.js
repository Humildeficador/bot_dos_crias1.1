const { useQueue, useHistory } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'back',
    description: 'Voltar uma musica!',
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
                    .setDescription(`${interaction.user} você precisa está em um canal de voz para usar esse comando.`)
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
                    .setDescription(`${interaction.user} não estou tocando nenhuma música.`)
                    .setColor('Random');
                await interaction.reply({
                    embeds: [embed], 
                    ephemeral: true,
                });
                return;
            };

            if (channelBot != channelMember) {
                const embed = new EmbedBuilder()
                    .setDescription(`${interaction.user} você precisa está no mesmo canal de voz que eu para usar esse comando.`)
                    .setColor('Random');
                await interaction.reply({
                    embeds: [embed], 
                    ephemeral: true,
                });
                return;
            };

            /* Cria o histórico e ve a música atual */
            const queue = useQueue(interaction.guild);
            const history = useHistory(interaction.guild);
            if (!history) {
                const embed = new EmbedBuilder()
                    .setDescription(`${interaction.user} Nenhuma musica tocada anteriormente.`)
                    .setColor('Random');
                await interaction.reply({ embeds: [embed] });
                return;
            };
            
            /* Tudo OK */
            await queue.history.back();
            const currentTrack = queue.currentTrack;
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user} voltou uma música.\n\n**\`Proxima música:\`**\n\`[${currentTrack.duration}]\` - ${currentTrack.title} - ${currentTrack.requestedBy}`)
                .setThumbnail(currentTrack.thumbnail)
                .setColor('Random');

            await interaction.reply({ embeds: [embed] });

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