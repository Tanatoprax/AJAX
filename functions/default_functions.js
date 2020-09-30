const client = require('../src/client');
const { owner } = require('../src/config.json');
const Discord = require('discord.js');
const jwt = require('jsonwebtoken');

module.exports = {
    error_handler: function (error) {
        
        const embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle('An Error Occured')
            .setDescription(error.code)
            .addField(`\u200b`, `**Type:** ${error.type}
            **Message:** ${error.message}`);
       
        client.users.fetch(owner, false).then(user => {
            return user.send(embed);
        });
    }, 

    sign_token: function (id) {
        return jwt.sign({ _id: id }, process.env.TOKEN_SECRET);
    }
}