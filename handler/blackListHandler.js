function getMessageAuthor(message) {
    return message.author.username.charAt(0).toUpperCase() + message.author.username.slice(1);
}

function checkIfNotAllowed(message) {
    const blacklist = process.env.BLACK_LIST.split(' ');
    const botList = process.env.BOT_LIST.split(' ');
    if(!message.author.bot) {
        if (blacklist.some(word => message.content.toLowerCase().includes(word))) {
            message.channel.send('Ups! ' + getMessageAuthor(message) + ' koristio si zabranjenu rec!! :rage: \n Poruka ce biti obrisana za 3 sekunde!').catch(r => console.log(r));
            message.delete({timeout: 3000});
        }
        if (botList.some(word => message.content.toLowerCase().includes(word))) {
            message.channel.send('Ej! ' + getMessageAuthor(message) + '! Pises o meni a?').catch(r => console.log(r));
        }
    }
}

module.exports = { checkIfNotAllowed };
