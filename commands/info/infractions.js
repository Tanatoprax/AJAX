const Discord = require("discord.js");
const { getinfractions, getAdmin, getMod } = require("../../functions/db_queries.js");
const { stripIndents } = require("common-tags");
const { kick_limit, ban_limit, version } = require("../../src/config.json");


module.exports = {
    name: "infractions",
    category: "info",
    permission: ["none", "moderator", "admin"],
    description: "Tells you how often you have been reported",
    usage: "[clear](only admins), [mention]",

    run: async (client, message, args, con) => {

        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.author;

        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);
        const tblid = Array.from(message.guild.name)
        tblid.forEach(function (item, i) { if (item == " ") tblid[i] = "_"; });
        con.query(`CREATE TABLE IF NOT EXISTS ${tblid.join("")}(member_id VARCHAR(20) NOT NULL UNIQUE, member_name TEXT NOT NULL, infractions INT NOT NULL);`)
        const infractions = await getinfractions(tblid, rMember, con);
        if (!rMember) {
            return message.reply("This member does not exist on this server");
        }

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setThumbnail(message.guild.iconURL())
            .setFooter(message.guild.name, client.user.displayAvatarURL())
            .setDescription(`**Current infractions of ${rMember.username}**`)
            .addField(`\u200b`, stripIndents`Currently you have **${infractions}** infractions.
            You will get **kicked at ${kick_limit}** infractions and **banned at ${ban_limit}** infractions`);


        if (args[0] === "clear") {
            if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === admin).id)) {
                return message.reply("You can't do that. Please contact a staff member!")
                    .then(m => m.delete({ timeout: 5000 }));
            }

            if (infractions === 0) {
                return message.reply("No infractions to clear");
            } else {
                con.query(`SELECT * FROM ${tblid.join("")} WHERE member_id = '${rMember.id}'`, (err, rows) => {
                    if (err) throw err;
                    let sql;

                    sql = `DELETE FROM ${tblid.join("")} WHERE member_id = '${rMember.id}'`

                    con.query(sql)
                });
                return message.reply(`Infractions for ${rMember} have been cleared`);
            }

        }

        return message.channel.send(embed);

    }

}