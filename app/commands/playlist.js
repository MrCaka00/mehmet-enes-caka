const {
	Util,
	MessageEmbed
} = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytdlDiscord = require("ytdl-core-discord");
var ytpl = require('ytpl');
const sendError = require("../util/error")
const fs = require('fs');

module.exports = {
	info: {
		name: "çalma-listesi",
		description: "Müzik sırasını gösterir.",
		usage: "<YouTube Playlist URL | Playlist Name>",
		aliases: ["çl", "çalma-listesi"],
	},

	run: async function (client, message, args) {
		const channel = message.member.voice.channel;
		if (!channel) return sendError("Müzik çalmam için ses kanalında olmalısın!", message.channel);
		const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
		var searchString = args.join(" ");
		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has("CONNECT")) return sendError("Ses kanalına bağlanamıyorum, uygun izinlere sahip olduğumdan emin olun!", message.channel);
		if (!permissions.has("SPEAK")) return sendError("Bu ses kanalında konuşamıyorum, uygun izinlere sahip olduğumdan emin olun!", message.channel);

		if (!searchString||!url) return sendError(`Usage: ${process.env.PREFIX}playlist <YouTube Playlist URL | Playlist Name>`, message.channel);
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			try {
				const playlist = await ytpl(url.split("list=")[1]);
				if (!playlist) return sendError("Playlist not found", message.channel)
				const videos = await playlist.items;
				for (const video of videos) {
					// eslint-disable-line no-await-in-loop
					await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
				}
				return message.channel.send({
					embed: {
						color: "GREEN",
						description: `✅  **|** Çalma Listesi: **\`${videos[0].title}\`** sıraya eklendi`
					}
				})
			} catch (error) {
				console.error(error);
				return sendError("Çalma listesi bulunamadı. :(",message.channel).catch(console.error);
			}
		} else {
			try {
				var searched = await yts.search(searchString)

				if (searched.playlists.length === 0) return sendError("Görünüşe göre bu çalma listesini YouTube'da bulamadım.", message.channel)
				var songInfo = searched.playlists[0];
				let listurl = songInfo.listId;
				const playlist = await ytpl(listurl)
				const videos = await playlist.items;
				for (const video of videos) {
					// eslint-disable-line no-await-in-loop
					await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
				}
				let thing = new MessageEmbed()
					.setAuthor("Çalma listesi sıraya eklendi.", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
					.setThumbnail(songInfo.thumbnail)
					.setColor("GREEN")
					.setDescription(`✅  **|**  Çalma Listesi: **\`${songInfo.title}\`** video sıraya \`${songInfo.videoCount}\` eklendi `)
				return message.channel.send(thing)
			} catch (error) {
				return sendError("Beklenmedik bir hata oluştu.",message.channel).catch(console.error);
			}
		}

		async function handleVideo(video, message, channel, playlist = false) {
			const serverQueue = message.client.queue.get(message.guild.id);
			const song = {
				id: video.id,
				title: Util.escapeMarkdown(video.title),
				views: video.views ? video.views : "-",
				ago: video.ago ? video.ago : "-",
                                duration: video.duration,
				url: `https://www.youtube.com/watch?v=${video.id}`,
				img: video.thumbnail,
				req: message.author
			};
			if (!serverQueue) {
				const queueConstruct = {
					textChannel: message.channel,
					voiceChannel: channel,
					connection: null,
					songs: [],
					volume: 80,
					playing: true,
					loop: false
				};
				message.client.queue.set(message.guild.id, queueConstruct);
				queueConstruct.songs.push(song);

				try {
					var connection = await channel.join();
					queueConstruct.connection = connection;
					play(message.guild, queueConstruct.songs[0]);
				} catch (error) {
					console.error(`I could not join the voice channel: ${error}`);
					message.client.queue.delete(message.guild.id);
					return sendError(`I could not join the voice channel: ${error}`, message.channel);

				}
			} else {
				serverQueue.songs.push(song);
				if (playlist) return;
				let thing = new MessageEmbed()
					.setAuthor("Müzik sıraya eklendi", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
					.setThumbnail(song.img)
					.setColor("YELLOW")
					.addField("İsim", song.title, true)
					.addField("Süre", song.duration, true)
					.addField("Tarafından istendi", song.req.tag, true)
					.setFooter(`İzlenme: ${song.views} | ${song.ago}`)
				return message.channel.send(thing);
			}
			return;
		}

async	function play(guild, song) {
			const serverQueue = message.client.queue.get(message.guild.id);
  let afk = JSON.parse(fs.readFileSync("./afk.json", "utf8"));
       if (!afk[message.guild.id]) afk[message.guild.id] = {
        afk: false,
    };
    var online = afk[message.guild.id]
    if (!song){
      if (!online.afk) {
        sendError("Ses kanalından ayrılıyorum çünkü sırada herhangi bir şarkı kalmadı. Eğer botun 7/24 seste kalmasını istiyorsanız 'b!afk' komutunu kullanabilirsiniz.", message.channel)
        message.guild.me.voice.channel.leave();//If you want your bot stay in vc 24/7 remove this line :D
        message.client.queue.delete(message.guild.id);
      }
            return message.client.queue.delete(message.guild.id);
}
 let stream = null; 
    if (song.url.includes("youtube.com")) {
      
      stream = await ytdl(song.url);
stream.on('error', function(er)  {
      if (er) {
        if (serverQueue) {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
  	  return sendError(`Beklenmedik bir hata oluştu.\nPossible type \`${er}\``, message.channel)

         }
       }
     });
}
 
      serverQueue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));
			const dispatcher = serverQueue.connection
         .play(ytdl(song.url,{quality: 'highestaudio', highWaterMark: 1 << 25 ,type: "opus"}))
        .on("finish", () => {
            const shiffed = serverQueue.songs.shift();
            if (serverQueue.loop === true) {
                serverQueue.songs.push(shiffed);
            };
            play(guild, serverQueue.songs[0]);
        })

    dispatcher.setVolume(serverQueue.volume / 100);
let thing = new MessageEmbed()
				.setAuthor("Started Playing Music!", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
				.setThumbnail(song.img)
				.setColor("BLUE")
				.addField("İsim", song.title, true)
				.addField("Süre", song.duration, true)
				.addField("Tarafından istendi", song.req.tag, true)
				.setFooter(`İzlenme: ${song.views} | ${song.ago}`)
    serverQueue.textChannel.send(thing);
}


	},



};
