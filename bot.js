const { Client, MessageAttachment } = require('discord.js');
const { vlcAPI } = require('./vlc.js')
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
	console.log(message);
	message.content = removeMention(message.content)
	// console.log(message.content);
	let args = message.content.split(' ');
	let command = args.shift().toLowerCase();
	if (!args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}! \n Use @kma-imax help to see available commands.`);
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
	else if (args[0] === 'version') {
		return message.channel.send('Version: Super Alpha Early Access');
	}
	else if (args[0] === 'help') {
		return message.channel.send(printhelp(commands));
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
