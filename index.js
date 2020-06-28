const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();
const colors = require('./colors.json')

const config = require('./config.json')
client.config = config;


const { GiveawaysManager } = require('discord-giveaways');
client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 750,
    default: {
        botsCanWin: false,
        exemptPermissions: [ "MANAGE_MESSAGES" ],
        embedColor: "#00FF27",
        reaction: "🎉"
    }
});

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

fs.readdir("./events/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`👌 Event loaded: ${eventName}`);
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

client.commands = new Discord.Collection();

/* Load all commands */
fs.readdir("./commands/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
        console.log(`👌 Command loaded: ${commandName}`);
    });
});

client.on('message', message =>{
    if (message.content === "/ping")
    message.channel.send('Ping?').then(m => m.edit(`API: ${m.createdTimestamp - message.createdTimestamp}ms. Web Socket: ${Math.round(client.ws.ping)}ms.`))
});

client.on('ready', () => {
    client.user.setActivity("Awaken On top!", {
        type: "PLAYING",
      });
    });

    client.on('message', message => {
        if (message.content === "/help") {
      const embed = new Discord.MessageEmbed()
         embed.setTitle("Commands Help")
         embed.addFields(
             { name: "Start", value: "usage: /start <Channel> <time> <winnercount> <Prize>. This commands starts a giveaway"},
             { name: "reroll", value: "usage: /reroll <givaway-message-id>. This command Rerolls a ended giveaway"},
             { name: "end", value: "usage: /end <giveaway-message-id>. This command ends a ongoing giveaway"},
             { name: "Ping", value: "usage: /ping. This Command showsThe bot's ping. "},
             { name: "Members", value: "esage: /members - Displays the current Member Count"})
        embed.setFooter("Need more help? Contact flickz#0865!")
        embed.setTimestamp()
        embed.setColor(colors.red)
        message.channel.send(embed);
    } else if (message.content === "/members") {
        const embed = new Discord.MessageEmbed()
        embed.setTitle("Total Members:")
        embed.setDescription(`Total Members: ${message.guild.memberCount}`)
        embed.setTimestamp()
        embed.setFooter("AwaKen On Top")
        embed.setColor(colors.indigo)
        message.channel.send(embed)
      }
    })
    

client.login(config.token);