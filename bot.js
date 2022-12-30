const { Client, MessageAttachment } = require('discord.js');
const { vlcAPI } = require('./vlc.js');
require('dotenv').config();
let discord_token = process.env.DISCORD_TOKEN
// const { getSections,getPlaylistItems } = require('./plex.js')

const client = new Client();
var user_tag = ''
let queue = {}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	user_tag = client.user.tag
});
const prefix = '@KMA-IMAX';

const commands = [
	{command:'help',desc:'Prints the help menu.'},
	{command:'add',desc:'Add a movie to the queue.'},
	{command:'skip',desc:'Skip the current item in the queue.'},
	{command:'previous',desc:'Go back to previous item in the queue.'},
	{command:'seek',desc:`Seek to somewhere in the current item. examples:
	 1000 -> seek to the 1000th second
	 +1H:2M -> seek 1 hour and 2 minutes forward
	 -10% -> seek 10% back.`},
	{command:'list',desc:'List available movies.'},
	{command:'version',desc:`Prints the current version of KMA-IMAX bot. Usage: ${prefix} version`},
]

function printhelp(commands){
	let helpout = '';
	for (let i = 0; i < commands.length; i++) {
		helpout += '**'+commands[i].command+'**: `'+commands[i].desc+'`\n'
	}
	return `### Help \n${helpout}`;
}

function removeMention(text) {
	try {
		return text.replace(/<@1058149336183230586>/g, '');
	} catch (e) {
		return text
	}
}

// vlcAPI('','123456','pl_stop');
// vlcAPI('','123456','pl_play&id=7');
client.on('message', message => {
	if (!message.content.includes('<@1058232627062124545>') && !message.content.includes('<@1058149336183230586>')){
		return
	}
	if (message.author.username.includes('KMA-IMAX')){
		return
	}
	console.log(`User: ${message.author.username} used command ${message.content}`);
	message.content = removeMention(message.content)
	let args = message.content.split(' ');
	let command = args.shift().toLowerCase();
	if (!args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}! \n Use @kma-imax help to see available commands.`);
	}
	if (message.author.bot == 'true'){
		return
	}
	else if (args[0] === 'add') {
		let string = ''
		for (let i = 1; i < args.length; i++) {
			string += `${args[i]} `
		}
		return message.channel.send(`Ok, adding ${string}to the queue. (just kidding this feature is not done yet)`);
	}
	else if (args[0] === 'list') {
		return message.channel.send(`I'm still working on this feature.`);
	}
	else if (args[0] === 'skip') {
		vlcAPI('','123456','pl_next');
		return message.channel.send('Skipping current content...');
	}
	else if (args[0] === 'seek') {
		vlcAPI('','123456',`seek&val=${args[1]}`);
		return message.channel.send(`Seeking to ${args[1]}.`);
	}
	else if (args[0] === 'previous') {
		vlcAPI('','123456','pl_previous');
		return message.channel.send('Going back to previous content...');
	}
	else if (args[0] === 'version') {
		return message.channel.send('Version: Super Alpha Early Access');
	}
	else if (args[0] === 'help') {
		return message.channel.send(printhelp(commands));
	}
	else {
		return message.channel.send(`Hey man, not sure what you're trying to do but thats not a valid command.`);
	}
});

client.on('messageReactionAdd', react => {
	// console.log(react);
	react.message.content = removeMention(react.message.content)
	console.log(react._emoji.name);
	console.log(react.message.content);
});

client.on('messageReactionRemove', react => {
	// console.log(react);
	react.message.content = removeMention(react.message.content)
	console.log(react._emoji.name);
	console.log(react.message.content);
});

client.login(discord_token);
