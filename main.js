const express = require('express');
const { Client } = require('discord.js');
const { config } = require('dotenv');
const { handler, insult } = require('./handler/commandsHandler.js');
const  { checkIfNotAllowed } = require('./handler/blackListHandler');

const client = new Client({
    disableMentions: 'everyone'
});

config({
    path: __dirname + "/.env"
});

const PREFIX = process.env.PREFIX;
const MESSAGE_TO_DELETE = process.env.MESSAGE_TO_DELETE;

client.on('ready', () => {
    console.log(`${client.user.tag} je ONLINE`);
    client.user.setPresence({
        status: "online"
    }).catch(r => console.log(r));
});

client.on('message', async message => {
    if(message.author.bot || !message.content.startsWith(PREFIX) || !message.content.startsWith('?')) {
        checkIfNotAllowed(message);
        return;
    } else if (message.content.toLowerCase().startsWith(PREFIX + "obrisi")) {
        async function clear() {
            message.delete().then();
            const fetched = await message.channel.messages.fetch({limit: MESSAGE_TO_DELETE}).then();
            await message.channel.bulkDelete(fetched).then();
        }
        await clear();
    } else if(message.content.toLocaleLowerCase().startsWith('?' + 'pucaj')) {
        await insult(message, message.content.slice(1));
    } else {
        await handler(message, message.content.slice(1));
    }
});

client.login(process.env.TOKEN).then();
