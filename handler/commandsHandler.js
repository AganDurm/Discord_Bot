const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { stopPool, createPool } = require('./poolHandler');
const { getDataFromUser, getInstagramData, getYoutubeData, getInfoAboutServer, sendLive } = require('./dataHandler');
const translate = require('translate-api');

let callCounter = 0;
let insultsArray = [
    " samo nastavi da pišeš i nekada ćeš napisati i nešto korisno 😅",
    " mislim da si glup, ali budimo iskreni, ne misle svi tako pozitivno o tebi 😁",
    " da li te roditelji stvarno nikada nisu pitali da pobegneš od kuće? 😳",
    " ti uspevaš da nas nateraš da cenimo ove članove što nikada ne pišu u čat 😂",
    " tvoje lice izgleda isto kao da si spavao u njemu a ne u krevetu 😆",
    " ti si kao ponedeljak. Niko te ne voli 🙄",
    " kada progutaš muvu, u tvom stomaku ima više mozga nego u tvojoj glavi 🥱",
    " izgledaš kao loš pokušaj. Da li su tvoji roditelji hemičari? 🤔",
    " bolje bi bilo da su tvoji roditelji otišli 5 minuta da šetaju 🤭",
    " da te je Kurt Cobain poznavao, ponovo bi se upucao! 🤣",
    " kad vidim tvoje lice, sve mi se više sviđa moje dupe 🤭",
    " imaš taman toliko moždanih ćelija da ne sereš u dnevnu sobu 🤣",
    " toliko si mutav i Mister Bin je ljubomoran 😅"
];

async function insult(message, command) {
    const author = getMessageAuthor(message);
    await message.channel.send(author + insultsArray[Math.floor(Math.random() * insultsArray.length)].toString());
}
async function handler(message, command) {
    console.log(command);
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
                message.channel.send(embedYT).then(() => console.log('!instagram'));
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
            await sendLive(message).catch(() => {
                getYoutubeData(message);
                message.channel.send('Fajta je live, brzo svi na njegov YouTube kanal')
            });
            break;
        case 'bot':
            getBotOwnerData(message);
            break;
        case 'komande':
            getCommands(message).catch(() => console.log("!komande -> datoteka nije pronadjena"));
            break;
        case 'foto':
            await getRandomPersonImage(message).catch(() => {
                message.channel.send("Trenutno slike nisu dostupne...")
            });
            break;
        case 'status':
            await message.channel.send('Koristen sam samo ' + callCounter + ' puta :confused: ');
            break;
        default:
            await noCmd(message).catch(() => message.channel.send('Polako bre, brzo kucas')).catch(() => console.log("!greska"));
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
    message.channel.send(embed).then(() => console.log("!komande"));
}

function getBotOwnerData(message) {
    const embed = new MessageEmbed()
        .setAuthor('FAJTA-Bot', 'https://www.durmex.de/img/durmex.jpg')
        .setTitle("Agan Durmisevic")
        .addField('Programirao: ', '21.09.2020', false);
    message.channel.send(embed).then(() => console.log('!bot'));
}

async function noCmd(message) {
    let embed = new MessageEmbed();
    embed.setAuthor('Greska: ');
    embed.setColor('RANDOM');
    embed.setDescription(message.content + ' nije komanda koju poznajem :confused:');
    embed.setThumbnail('https://cdn.icon-icons.com/icons2/1465/PNG/512/756exclamationmark_100528.png');
    embed.setFooter('Kucaj !komande da vidis listu mojih komandi');
    await message.channel.send(embed);
}

function todi(message) {
    const embed = new MessageEmbed()
        .setTitle("INFORMACIJA ZA TEBE: ")
        .setThumbnail(message.author.displayAvatarURL())
        .setColor('RANDOM')
        .setDescription("Todi je najbolji igrač na svetu!");
  message.channel.send(embed);
}

async function chatBot(message, cmd) {
    let command = cmd;
    if(cmd.endsWith('?') || cmd.endsWith('<') || cmd.endsWith('>')) {
        command = cmd.slice(0, -1);
    }
    let request = await fetch(process.env.CHAT_BOT_API+command+'&key='+process.env.BOT_KEY).then(response => response.json());
    let answerMessage = await request.response;
    await translate.getText(answerMessage,{to: 'hr'}).then((text) => {
        console.log(text);
        message.channel.send(text);
    });
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

module.exports = { handler, insult };
