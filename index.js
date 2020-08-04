const Discord = require('discord.js");

const client = new Discord.Client();
const colors = require('./colors.json')

const config = require('./config.json')

client.on('message', message =>{
    if (message.content === "/ping")
    message.channel.send('Ping?').then(m => m.edit(`API: ${m.createdTimestamp - message.createdTimestamp}ms. Web Socket: ${Math.round(client.ws.ping)}ms.`))
});

client.on('ready', () => {
    client.user.setActivity("/nuke", {
        type: "PLAYING",
      });
    });

client.on('message', message => {
      if (message.content === "/nuke")
      message.channel.send("<@&739962712850694245>, this skid wants to nuke!")
}

client.login(config.token);
