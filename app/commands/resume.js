const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "devam",
    description: "Duraklatılan müziği devam ettirir.",
    usage: "?devam",
    aliases: ["devam"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
      .setDescription("▶ Müzik senin için devam ettiriyorum!")
      .setColor("YELLOW")
      .setAuthor("Müzik devam ettiriliyor!", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      return message.channel.send(xd);
    }
    return sendError("Şu anda hiçbir şey çalmıyor.", message.channel);
  },
};
