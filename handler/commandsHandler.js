const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { stopPool, createPool } = require('./poolHandler');
const { getDataFromUser, getInstagramData, getYoutubeData, getInfoAboutServer, sendLive } = require('./dataHandler');

let callCounter = 0;

async function handler(message, command) {
    callCounter++;
    const author = getMessageAuthor(message);

    switch (command) {
        case 'halo':
            await message.channel.send("Halo " + author + ` :blush:`);
            break;
        case 'ja':
            await getDataFromUser(message);
            break;
        case 'instagram':
            await getInstagramData(message).catch(() => {
                let embedYT = new MessageEmbed()
                    .addField('Fajta','Zapratite me na Insta')
                    .addField('Link:', process.env.INSTAGRAM)
                    .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png')
                    .setColor("RED");
                message.channel.send(embedYT).then(() => console.log('!youtube'));
            });
            break;
        case 'youtube':
            await getYoutubeData(message);
            break;
        case 'server':
            getInfoAboutServer(message);
            break;
        case 'izbor':
            createPool(message);
            break;
        case 'rezultat':
            await stopPool(message);
            break;
        case 'livesmo':
            await sendLive(message);
            break;
        case 'bot':
            getBotOwnerData(message);
            break;
        case 'komande':
            getCommands(message);
            break;
        case 'foto':
            await getRandomPersonImage(message);
            break;
        case 'status':
            await message.channel.send('Koristen sam samo ' + callCounter + ' puta :confused: ');
            break;
        default:
            await chatBot(message, command);
            break;
    }
}

function getMessageAuthor(message) {
    return message.author.username.charAt(0).toUpperCase() + message.author.username.slice(1);
}

function getCommands(message) {
    let embed = new MessageEmbed()
        .attachFiles('./komande.txt')
        .setFooter('Procitaj komande koje mozes koristi ovdje.');
    message.channel.send(embed);
}

function getBotOwnerData(message) {
    const embed = new MessageEmbed()
        .setAuthor('Agan Durmisevic', 'https://www.durmex.de/img/durmex.jpg')
        .setTitle("durmex Bot")
        .addField('Programiran: ', '21.09.2020', false);
    message.channel.send(embed);
}

async function chatBot(message, cmd) {
    let command = cmd;
    if(cmd.endsWith('?') || cmd.endsWith('<') || cmd.endsWith('>')) {
        command = cmd.slice(0, -1);
    }
    let request = await fetch(process.env.CHAT_BOT_API+command).then(response => response.json());
    let answerMessage = await request.response;
    message.channel.send(answerMessage).catch(r => console.log(r));
}

async function getRandomPersonImage(message) {
    let url = await fetch('https://thispersondoesnotexist.com/image?'+(new Date).getTime()).then(url => url.url);
    let data = await url;
    await message.channel.send(data);
    let embed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription('Ova osoba ne postoji');
    await message.channel.send(embed);
}

module.exports = { handler };
