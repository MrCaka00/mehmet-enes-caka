const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    info: {
        name: "ayrıl",
        aliases: ["dc", "ayrıl", "çıkgitlan","disconnect"],
        description: "Ses kanalından ayrılır!",
        usage: "?ayrıl",
    },

    run: async function (client, message, args) {
        let channel = message.member.voice.channel;
        if (!channel) return sendError("Bir ses kanalında olmalısın!", message.channel);
        if (!message.guild.me.voice.channel) return sendError("Şu anda herhangi bir ses kanalında değilim.", message.channel);

        try {
            await message.guild.me.voice.channel.leave();
        } catch (error) {
            await message.guild.me.voice.kick(message.guild.me.id);
            return sendError("Ses kanalından ayrılmaya çalışıyorum.", message.channel);
        }

        const Embed = new MessageEmbed()
            .setAuthor("Ses kanalından ayrılır.", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
            .setColor("GREEN")
            .setTitle("Başarılı")
            .setDescription("🎶 Ses kanalından ayrıldım.")
            .setTimestamp();

        return message.channel.send(Embed).catch(() => message.channel.send("🎶 Ses kanalından ayrıldım."));
    },
};
