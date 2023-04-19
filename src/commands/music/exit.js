const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'exit',
    description: 'Sair do canal!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //deleted: true,

    callback: async (client, interaction) => {
        try {
            const channelBot = interaction.guild.members.me.voice.channel;
            const channelMember = interaction.member.voice.channel;
            const queue = useQueue(interaction.guild);

            /* Membro no mesmo canal do bot e se ele está tocando*/
            
            if (channelBot != channelMember && queue.node.isPlaying()) {
                const embed = new EmbedBuilder()
                    .setDescription(`${interaction.user} você precisa está no mesmo canal de voz que eu para usar esse comando.`)
                    .setColor('Random');
                await interaction.reply({
                    embeds: [embed], 
                    ephemeral: true,
                });
                return;
            };

            /* Tudo OK */
            await interaction.reply({
                content: `${interaction.user} por que você me odeia? 😥`,
                ephemeral: false,
            });
            queue.delete();

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