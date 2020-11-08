const { MessageEmbed } = require('discord.js');
const fetch = require("node-fetch");

function getMessageAuthor(message) {
    return message.author.username.charAt(0).toUpperCase() + message.author.username.slice(1);
}

async function getInstagramData(message) {
    await fetch('https://www.instagram.com/_fajta/?__a=1')
        .then(url => url.json()).then((url) => {
            let embed = new MessageEmbed()
                .addField(url.graphql.user.full_name,'Zapratite me i na Insta')
                .addField('Link:', 'https://www.instagram.com/_fajta/')
                .setThumbnail(url.graphql.user.profile_pic_url)
                .setColor("BLUE");
            message.channel.send(embed);ö
        })
        .catch(onerror => console.log(onerror));
}

 async function getYoutubeData(message) {
    let embedYT = new MessageEmbed()
        .addField('Fajta','Baci Subscribe na Youtube')
        .addField('Link:', 'https://www.youtube.com/channel/UCbvmgMOvIFLU0-FYaFr_goQ')
        .setThumbnail('https://www.android-user.de/wp-content/uploads/2014/02/33799-youtube-icon_max.png')
        .setColor("RED");
    await message.channel.send(embedYT).then(() => console.log('!youtube'));
}

async function getDataFromUser(message) {
    const member = message.guild.members.cache.get(message.author.id);
    const author = getMessageAuthor(message);

    const embed = new MessageEmbed()
        .setTitle(author)
        .setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL())
        .setThumbnail(member.user.displayAvatarURL())
        .addField('Created On', member.user.createdAt.toLocaleString(), true)
        .addField('Joined On', member.joinedAt, true)
        .addField('Kickable', trueOrFalseAsText(member.kickable), false)
        .addField('Voice Channel', member.voice.channel ? member.voice.channel.name + `(${member.voice.channel.id})` : 'None')
        .setDescription(`${member.roles.cache.map(role => role.toString()).join(' ')}`);
    message.channel.send(embed);
}

function getInfoAboutServer(message) {
    const { guild } = message;
    const embed = new MessageEmbed()
        .setAuthor(`${guild.name} (${guild.id})`, guild.iconURL())
        .setThumbnail(guild.iconURL())
        .addField('Datum kreiranje servera', guild.createdAt.toLocaleString(), true)
        .addField('Server je napravio', guild.owner.user.tag)
        .addField('Broj članova', guild.memberCount, true)
        .addField('Pravi članovi', guild.members.cache.filter(member => !member.user.bot).size, true)
        .addField('Botovi', guild.members.cache.filter(member => member.user.bot).size, true)
        .addField('Broj kanala na serveru', activeChannels(guild), true)
        .addField('Text kanali', guild.channels.cache.filter(ch => ch.type === 'text').size, true)
        .addField('Govorni kanali', guild.channels.cache.filter(ch => ch.type === 'voice').size, true)
        .setColor('#5CC5FF')
        .setDescription(`${guild.roles.cache.map(role => role.toString()).join(' ')}`);
    message.channel.send(embed);
}

async function sendLive(message) {
    let embedYT = new MessageEmbed();
    let liveLink = "";
    let liveImage = "";

    const URL = process.env.YOUTUBE_SEARCH + process.env.CHANNEL_ID + '&type=video&eventType=live&key=' + process.env.YOUTUBE_API;
    let getYouTubeData = await fetch(URL);

    if (getYouTubeData.ok) {
        let json = await getYouTubeData.json();
        let videoId = await json.items[0].id.videoId;
        liveLink = process.env.STREAM_LINK+videoId;
        liveImage = await json.items[0].snippet.thumbnails.medium.url;

        embedYT.addField('Live smo','Brzo na Youtube')
            .addField('Link:', liveLink)
            .setThumbnail(liveImage)
            .setColor("RANDOM");
        await message.channel.send(embedYT);
    } else {
        embedYT
            .addField('Greska', 'Izvini pokusaj posle opet...')
            .setColor("RED");
        await message.channel.send(embedYT);
    }
}

function trueOrFalseAsText(booleanTrueOrFalse) {
    if(booleanTrueOrFalse) { return 'Yes';} else {return 'No';}
}

function activeChannels(server) {
    return server.channels.cache.filter(ch => ch.type === 'text').size + server.channels.cache.filter(ch => ch.type === 'voice').size;
}

module.exports = { getInstagramData, getYoutubeData, getDataFromUser, getInfoAboutServer, sendLive };
