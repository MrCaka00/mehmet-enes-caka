const { Util, MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "geç",
    description: "O anda çalan müziği atlar.",
    usage: "?geç",
    aliases: ["geç", "g"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel)return sendError("Müzik açmam için ses kanalında olmalısın!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError("Şu anda atlayabileceğim herhangi bir şarkı yok.", message.channel);
        if(!serverQueue.connection)return
if(!serverQueue.connection.dispatcher)return
     if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
      .setDescription("▶ Müziği senin için devam ettiriyorum!")
      .setColor("YELLOW")
      .setTitle("Müzik devam ettirildi!")
       
   return message.channel.send(xd).catch(err => console.log(err));
      
    }


       try{
      serverQueue.connection.dispatcher.end()
      } catch (error) {
        serverQueue.voiceChannel.leave()
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: Müzik duraklatıldı ve sıra temizlendi.: ${error}`, message.channel);
      }
    message.react("✅")
  },
};
