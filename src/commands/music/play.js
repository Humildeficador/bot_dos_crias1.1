const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');
const capitalize = require('../../utils/capitalize')

module.exports = {
    name: 'play',
    description: 'Toca uma música!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,
    options: [
        {
            name: 'termo',
            description: 'Busca uma música.',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    callback: async (client, interaction) => {
        try {
            /* Verifica se o membro está em um canal */
            if (!interaction.member.voice.channel) {
                const embed = new EmbedBuilder()
                    .setDescription(`${interaction.user} você precisa está em um canal de voz para usar esse comando.`)
                    .setColor('Random');
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
                return;
            }
            /* Faz a busca do termo */
            let termo = interaction.options.getString('termo');
            const result = await client.player.search(termo, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            /* Verifica se tem resultado */
            if (!result.hasTracks()) {
                const embed = new EmbedBuilder()
                    .setDescription(`${interaction.user} nenhum resultado encontrado.`)
                    .setColor('Random');
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: false,
                });
                return;
            }

            const track = result.tracks[0];
            const source = capitalize(track.raw.source)

            /* Cria o Embed */
            const embed = new EmbedBuilder()
                .setAuthor({ name: source })
                .setTitle(`${track.title}`)
                .setImage(track.thumbnail)
                .setURL(track.url)
                .setColor('Random')
                .setDescription(`Views: ${track.views}`)
                .setFooter({ text: `Duração: ${track.duration}` })
            await interaction.reply({ embeds: [embed] });

            const channel = interaction.member.voice.channel;
            /* Tudo OK */
            await client.player.play(channel, track, {
                nodeOptions: {
                    metadata: interaction,
                    leaveOnEmpty: null,
                    leaveOnEmptyCooldown: 300000,
                    leaveOnEnd: null,
                    leaveOnEndCooldown: 300000,
                },
            });

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