const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "çıkar",
    description: "Sıradan müziği çıkarır.",
    usage: "?çıkar",
    aliases: ["çıkar"],
  },

  run: async function (client, message, args) {
   const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("There is no queue.",message.channel).catch(console.error);
    if (!args.length) return sendError(`Usage: ${client.config.prefix}\`remove <Queue Number>\``);
    if (isNaN(args[0])) return sendError(`Usage: ${client.config.prefix}\`remove <Queue Number>\``);
    if (queue.songs.length == 1) return sendError("There is no queue.",message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(`Sıra sadece ${queue.songs.length} uzunluğunda olabilir!`,message.channel).catch(console.error);
try{
    const song = queue.songs.splice(args[0] - 1, 1); 
    sendError(`❌ **|** Müzik: **\`${song[0].title}\`** sıradan çıkarıldı.`,queue.textChannel).catch(console.error);
                   message.react("✅")
} catch (error) {
        return sendError(`:notes:Beklenmedik bir hata oluştu.\nPossible type: ${error}`, message.channel);
      }
  },
};
