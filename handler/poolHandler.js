const { MessageEmbed } = require('discord.js');

let userCreatedPolls = new Map();
let pollOptions = {
    option1Vote: 0,
    option2Vote: 0
};

function createPool(message) {
    if (userCreatedPolls.has(message.author.id)) {
        message.channel.send("You already have a poll going on right now.").then(a => console.log("Already have" + a));
    } else {
        message.channel.send("Vi birate sta danas da strimam: ").catch(r => console.log(r));
        getPools(message).catch(r => console.log(r));
    }
}

async function stopPool(message) {
    let embed = new MessageEmbed();

    if (userCreatedPolls.has(message.author.id)) {
        userCreatedPolls.get(message.author.id).stop();
        userCreatedPolls.delete(message.author.id);

        if (pollOptions.option1Vote > pollOptions.option2Vote) {
            embed.addField('Gotovo', 'Odlucili ste da danas strimamo ' + process.env.OPTION1);
            embed.setDescription('Dodjite na strim da se zabavimo sa ' + process.env.OPTION1 + 'om');
            embed.addField('Link:', 'https://www.youtube.com/channel/UCbvmgMOvIFLU0-FYaFr_goQ');
            embed.setThumbnail('https://www.android-user.de/wp-content/uploads/2014/02/33799-youtube-icon_max.png');
            embed.setColor("RED");
            await message.channel.send(embed);
        } else if (pollOptions.option1Vote < pollOptions.option2Vote) {
            embed.addField('Gotovo', 'Odlucili ste da danas strimamo ' + process.env.OPTION2);
            embed.setDescription('Dodjite na strim da se zabavimo sa ' + process.env.OPTION2 + 'om');
            embed.addField('Link:', 'https://www.youtube.com/channel/UCbvmgMOvIFLU0-FYaFr_goQ');
            embed.setThumbnail('https://www.android-user.de/wp-content/uploads/2014/02/33799-youtube-icon_max.png');
            embed.setColor("RED");
            await message.channel.send(embed);
        } else {
            embed.addField('Gotovo', 'Nazalost opcije imaju isti broj glasova!', false);
            embed.setDescription('Dodjite na strim i tamo cemo odluciti');
            embed.addField('Link:', 'https://www.youtube.com/channel/UCbvmgMOvIFLU0-FYaFr_goQ');
            embed.setThumbnail('https://www.android-user.de/wp-content/uploads/2014/02/33799-youtube-icon_max.png');
            embed.setColor("RED");
            await message.channel.send(embed);
        }
        pollOptions = {
            option1Vote: 0,
            option2Vote: 0
        };
    } else {
        message.channel.send("Trenutno nemas svoje glasanje!").catch(r => console.log(r));
    }
}

async function getPools(message) {
    let embed = new MessageEmbed()
        .setTitle("Danas strimam:")
        .addField("Opcija 1 ", process.env.OPTION1 + ' 🟢', true)
        .addField(" Opcija 2 ", process.env.OPTION2 + ' 🔴', true);

    let confirm = await message.channel.send(embed);
    await confirm.react('🟢');
    await confirm.react('🔴');
    await poolReaction(message, confirm)
}

async function poolReaction(message, confirm) {
    let reactionFilter = (reaction, user) => (user.id === message.author.id) && !user.bot;
    let reaction = (await confirm.awaitReactions(reactionFilter, {max: 1})).first();

    let pollFilter = m => !m.bot;
    let voteCollector = message.channel.createMessageCollector(pollFilter, {
        time: 600
    });
    userCreatedPolls.set(message.author.id, voteCollector);

    if (reaction.emoji.name === '🟢') {
        pollOptions.option1Vote += 1;

        console.log(pollOptions);
    } else if (reaction.emoji.name === '🔴') {

        pollOptions.option2Vote += 1;
        console.log(pollOptions);
    }
}

module.exports = { createPool, stopPool };
