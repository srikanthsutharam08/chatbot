var builder = require('botbuilder')
var restify = require('restify')

var server = restify.createServer()
server.listen(3978, function() {
	console.log("listening on ", server.name, server.url)
})
var connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
})

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen())

var intents = new builder.IntentDialog();
bot.dialog('/', intents)
intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);