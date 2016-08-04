var restify = require('restify');
var builder = require('botbuilder');

// Get secrets from server environment
//var botConnectorOptions = { 
//    appId: 'b4f44179-a489-4c94-a8b1-ea0b8067a02a', 
//    appPassword: 'oJ79dj9fcoU9KTWXngWc0Wx' 
//};

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});

var connector = new builder.ChatConnector({
	appId: 'b4f44179-a489-4c94-a8b1-ea0b8067a02a', 
    appPassword: 'oJ79dj9fcoU9KTWXngWc0Wx' 
});
// Create bot
var bot = new builder.UniversalBot(connector);
// Handle Bot Framework messages
server.post('/api/messages', connector.listen());

// Serve a static web page
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));



//var bot = new builder.BotConnectorBot(botConnectorOptions);
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