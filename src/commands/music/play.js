const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    name: 'play',
    description: 'Toca uma música!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,
    options: [
        {
            name: 'url',
            description: 'Busca a URL da música no YT.',
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
        let url = interaction.options.getString('url');
        const result = await client.player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE_VIDEO,
        });

        /* Verifica se tem resultado */
        if (!result.hasTracks()) {
            await interaction.editReply("Nenhum resultado encontrado.");
            return;
        }

        const tracks = result.tracks[0];
        /* Cria o Embed */
        const embed = new EmbedBuilder()
            .setTitle(`${tracks.title}`)
            .setImage(tracks.thumbnail)
            .setURL(tracks.url)
            .setColor('Random')
            .setDescription(`Views: ${tracks.views}`)
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