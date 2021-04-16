module.exports = async (client) => {//
  console.log(`[API] Logged in as ${client.user.username}`);
  await client.user.setActivity("?yardım ile Mehmet Enes ÇAKA", { //Oynuyor Kısmı
    type: "LISTENING",//LISTENING, WATCHING, PLAYING, STREAMING
  });
   client.user.setStatus('idle')
};

 
  
 

