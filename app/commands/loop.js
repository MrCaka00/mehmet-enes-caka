const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "döngü",
    description: "Parçayı döngüye sokar.",
    usage: "?döngü",
    aliases: ["döngü"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
       if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            return message.channel.send({
                embed: {
                    color: "GREEN",
                    description: `🔁  **|**  Döngü **\`${serverQueue.loop === true ? "aktif" : "deaktif"}\`**`
                }
            });
        };
    return sendError("Şu anda hiçbir şey çalmıyor.", message.channel);
  },
};
