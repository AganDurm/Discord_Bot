const { Client, MessageEmbed } = require('discord.js');
const { config } = require('dotenv');
const fetch = require("node-fetch");

const prefix = "!";
const client = new Client({
    disableEveryone: true
});

config({
    path: __dirname + "/.env"
});

client.on('ready', () => {
    console.log(`${client.user.username} je ONLINE`);

    client.user.setPresence({
        status: "online",
        game: {
            name: "me getting developed",
            type: "WATCHING"
        }
    });
});

client.on('message', async message => {
    if(!message.content.startsWith(prefix)) return;
    message.delete({timeout: 1000});

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const author = message.author.username.charAt(0).toUpperCase() + message.author.username.slice(1);

    const cmd = args.shift().toLowerCase();
    if(cmd === 'halo') {
        await message.channel.send("Halo " + author + ` :blush:`);
    } else if(cmd === 'ja') {
        let embed = new MessageEmbed();
        embed.setTitle(author);
        embed.setThumbnail(message.author.displayAvatarURL());
        embed.setColor('RANDOM');
        embed.setDescription("ID: " + message.author.id + "\n" + "Discord: " + message.author.tag);
        await message.channel.send(embed);
    } else if(cmd === 'komande') {
        let embed = new MessageEmbed();
        embed.setColor('RANDOM');
        embed.setAuthor('Komande: ');
        embed.setDescription(
            '!halo je pozdrav komanda -> Halo i vase ime' + "\n" +
            '!ja daje informacije o vasem Diskordu -> ID, Slika, Ime, Ime sa Tag' + "\n" +
            '!komande je lista mogucih komandi'  + "\n" +
            '!insta je reklama za instagram -> Ime, opis, link i profilna' + "\n" +
            '!youtube je reklama za youtube -> Kanal, opis, link'
        );
        await message.channel.send(embed);
    } else if(cmd === 'insta') {
        let url = await fetch('https://www.instagram.com/_fajta/?__a=1').then(url => url.json());
        let embed = new MessageEmbed();

        embed.addField(await url.graphql.user.full_name,'Zapratite me i na Insta');
        embed.addField('Link:', 'https://www.instagram.com/_fajta/');
        embed.setThumbnail(await url.graphql.user.profile_pic_url);
        embed.setColor("BLUE");
        await message.channel.send(embed);
    } else if(cmd === 'youtube') {
        let embedYT = new MessageEmbed();

        embedYT.addField('Fajta','Baci Subscribe na Youtube');
        embedYT.addField('Link:', 'https://www.youtube.com/channel/UCbvmgMOvIFLU0-FYaFr_goQ');
        embedYT.setThumbnail('https://www.android-user.de/wp-content/uploads/2014/02/33799-youtube-icon_max.png');
        embedYT.setColor("RED");
        await message.channel.send(embedYT);
    } else {
        let embed = new MessageEmbed();
        embed.setAuthor('Greska: ');
        embed.setColor('RANDOM');
        embed.setDescription(message.content + ' nije komanda koju poznajem :confused:');
        embed.setThumbnail('https://cdn.icon-icons.com/icons2/1465/PNG/512/756exclamationmark_100528.png');
        embed.setFooter('Kucaj !komande da vidis listu mojih komandi');
        await message.channel.send(embed);
    }
});

client.login(process.env.TOKEN);
