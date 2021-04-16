const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "dur",
    description: "O anda çalan müziği duraklatır.",
    usage: "?dur",
    aliases: ["dur"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
	    try{
      serverQueue.connection.dispatcher.pause()
	  } catch (error) {
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: Müzik duraklatıldı ve sıra temizlendi.: ${error}`, message.channel);
      }	    
      let xd = new MessageEmbed()
      .setDescription("⏸ Müziği senin için duraklattım!")
      .setColor("YELLOW")
      .setTitle("Müzik duraklatıldı!")
      return message.channel.send(xd);
    }
    return sendError("Şu anda hiçbir şey çalmıyor.", message.channel);
  },
};
