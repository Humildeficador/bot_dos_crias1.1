const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    name: 'procurar',
    description: 'Faz uma busca.',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,
    options: [
        {
            name: 'termo',
            description: 'Retorna uma lista com os resultados da busca.',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    callback: async (client, interaction) => {
        try {
            /* Faz a busca do termo. */
            let termo = interaction.options.getString('termo');
            const result = await client.player.search(termo, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            /* Verifica se tem resultado. */
            if (!result.hasTracks()) {
                await interaction.reply('Nenhum resultado encontrado.',);
                return;
            }

            /* Monta string com as tracks */
            const tracks = result.tracks.slice(0, 5);
            const trackString = tracks.map((v, i) => {
                return `\`${i + 1}) [${v.duration}]\` ${v.title},\n \`URL:\` ${v.url}\n`
            })
                .join('\n');

            /* Tudo OK */
            const embed = new EmbedBuilder()
                .setDescription(`**\`Resultados:\`\n** ${trackString}\n\nCopie o link e use no comando \`/play\``)
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