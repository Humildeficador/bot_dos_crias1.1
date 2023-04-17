const { Player } = require('discord-player');

module.exports = (client) => {
    client.player = Player.singleton(client, {
        ytdlOptions: {
            quality: "highestaudio",
            highWaterMark: 1 << 25,
        },
    });
};