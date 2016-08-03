var restify = require('restify');
var builder = require('botbuilder');

// Get secrets from server environment
var botConnectorOptions = { 
    appId: 'b4f44179-a489-4c94-a8b1-ea0b8067a02a', 
    appSecret: 'oJ79dj9fcoU9KTWXngWc0Wx' 
};

// Create bot
var bot = new builder.BotConnectorBot(botConnectorOptions);
bot.add('/', function (session) {
    
    //respond with user's message
    session.send("You said assfsasafssafsafsaafssfsdfadsf " + session.message.text);
});

// Setup Restify Server
var server = restify.createServer();

// Handle Bot Framework messages
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());

// Serve a static web page
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});