const { useQueue } = require('discord-player');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'skipto',
    description: 'Pula para uma música da fila!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,
    options: [
        {
            name: 'musica',
            description: 'Pula para uma música.',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
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

            const queue = useQueue(interaction.guild.id);
            const tracks = queue.tracks.toArray();
            const currentTrack = queue.currentTrack;

            /* Nenhuma música na fila */
            if (!tracks[0]) {
                const embed = new EmbedBuilder()
                    .setDescription(`**\`Musica Atual:\n\`**${currentTrack.title} - ${currentTrack.requestedBy}\n Nenhuma música para ser removida da fila.`)
                    .setThumbnail(currentTrack.thumbnail)

                await interaction.reply({ embeds: [embed] });
                return;
            };

            let musica = (interaction.options.getString('musica') - 1);

            const queueString = tracks.slice(0, 10).map((v, i) => {
                return `\`${i + 1}) [${v.duration}]\` ${v.title} - ${v.requestedBy}`;
            }).join('\n');

            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user}**\`Pulou para:\`**\n
                \`${musica + 1}) [${tracks[musica].duration}]\`${tracks[musica].title} - ${tracks[musica].requestedBy}\n\n **Fila:**\n${queueString}`)
                .setThumbnail(tracks[musica].thumbnail)
                .setColor('Random');
            await interaction.reply({ embeds: [embed] });
            queue.node.skipTo(musica);


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
}