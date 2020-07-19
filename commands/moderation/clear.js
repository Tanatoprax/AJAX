const { getAdmin, getMod } = require("../../functions/db_queries.js");

module.exports = {
    name: "clear",
    category: "moderation",
    permission: ["moderator", "admin"],
    description: "Clears the chat",
    run: async (client, message, args, con) => {
        if (message.deletable) {
            message.delete();
        }

        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);

        if (admin === null) {
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (moderator === null) {
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }

        // Member doesn't have permissions
        if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === admin).id)) {
            if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === moderator).id)) {
                return message.reply("You can't delete messages....").then(m => m.delete({ timeout: 5000 }));
            }
        }

        // Check if args[0] is a number
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("Yeah.... That's not a number? I also can't delete 0 messages by the way.").then(m => m.delete({ timeout: 5000 }));
        }

        // Maybe the bot can't delete messages
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("I can't manage messages. Maybe go fix that?").then(m => m.delete({ timeout: 5000 }));
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.channel.send(`I deleted \`${deleted.size}\` messages.`)).then(m => m.delete({ timeout: 5000 }))
            .catch(err => message.reply(`Something went wrong... ${err}`));
    }
}
