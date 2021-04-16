const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "şuanki",
    description: "O anda çalan müziğin ismini gösterir.",
    usage: "?şuanki",
    aliases: ["şuanki"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Şu anda hiçbir şey çalmıyor.", message.channel);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .setAuthor("Oynatılıyor!", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      .setThumbnail(song.img)
      .setColor("BLUE")
      .addField("İsim", song.title, true)
      .addField("Süre", song.duration, true)
      .addField("Tarafından istendi", song.req.tag, true)
      .setFooter(`İzlenme: ${song.views} | ${song.ago}`)
    return message.channel.send(thing)
  },
};
