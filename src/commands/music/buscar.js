const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    name: 'buscar',
    description: 'Toca uma música!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,
    options: [
        {
            name: 'termo',
            description: 'Busca uma musica',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],

    callback: async (client, interaction) => {
        if (!interaction.member.voice.channel) {
            await interaction.reply({
                content: 'Você precisa está em um canal de voz para usar esse comando!',
                ephemeral: false,
            });
            return;
        }
        await interaction.deferReply();

        /* Faz a busca da URL */
        let termo = interaction.options.getString('termo');
        const result = await client.player.search(termo, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        });

        /* Verifica se tem resultado */
        if (!result.hasTracks()) {
            await interaction.editReply("Nenhum resultado encontrado.");
            return;
        }

        const tracks = result.tracks[0];
        const views = '';
        /* tracks.views > 0 ? views = `Views: ${tracks.views}` : ''; */
        console.log(tracks.views)

        /* Cria o Embed */
        const embed = new EmbedBuilder()
            .setTitle(`${tracks.title}`)
            .setImage(tracks.thumbnail)
            .setURL(tracks.url)
            .setColor('Random')
            .setFooter({text: `Duração: ${tracks.duration}`})
        await interaction.editReply({ embeds: [embed] })

        await client.player.play(interaction.member.voice.channel, tracks, {
            nodeOptions: {
                metadata: interaction,
            },
            leaveOnEnd: false,
            leaveOnEndCooldown: 300,
        });
    },
};