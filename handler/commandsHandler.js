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
            message.delete({timeout: 300});
            await getInstagramData(message);
            break;
        case 'youtube':
            message.delete({timeout: 300});
            await getYoutubeData(message);
            break;
        case 'server':
            getInfoAboutServer(message);
            break;
        case 'izbor':
            message.delete({timeout: 300});
            createPool(message);
            break;
        case 'rezultat':
            message.delete({timeout: 300});
            await stopPool(message);
            break;
        case 'livesmo':
            message.delete({timeout: 300});
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
            message.delete({timeout: 300});
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
