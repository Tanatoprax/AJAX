const { Client, RichEmbed, Collection } = require("discord.js");
const { token, prefix, version, status, greeting_channel, } = require('./config.json');
const fs = require("fs");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("./functions.js");


const client = new Client({
    disableEveryone: true
});

client.reply = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");









["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);

});

client.on("ready", () => {

    console.log(`I'm now online, my name is ${client.user.username}`);
    //console.log(client.channels);

    client.fetchUser("595341356432621573", false).then(user => {
        user.send(`I'm online`)
    });

    client.user.setPresence({
        status: "online",
        game: {
            name: `${status}`,
            type: "WATCHING"
        }
    });
});



client.on("guildMemberAdd", async member => {
    if (member.bot) return;
    const channel = member.guild.channels.find(channel => channel.name === `${welcome_cannel}`);
    if (!channel) return;


    const embed = new RichEmbed()
        .setColor("RANDOM")
        .setTimestamp()
        .setAuthor(`${member}`, member.user.displayAvatarURL)
        .setDescription(stripIndents`Welcome to the idiotsatlarge discord server.
        We are a clan of friendly people who have fun and work together.
        You have any questions or need help? Just ask ingame or on this server. :grin:
        To keep the clan going, player inactivity fo 30 days will result in discharge.
        If you are away for more than 30 days, just message @jonhhammer or leave a message here on the server.`);

    //const emoji = ["??"]

    //const m = await channel.send(embed);
    //const reacted = await promptMessage(m, member.user, 90, emoji);


    //if (reacted === emoji) {
    //    member.addRole("test-role").catch(e => console.log(e.message))
    //}


    return channel.send(embed);
        
    
});

client.on("message", async message => {

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command)
        command.run(client, message, args);

   
    
})



client.login(token);


