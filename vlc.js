
// http://127.0.0.1:8080/requests/status.xml?command=pl_stop
// http://127.0.0.1:8080/requests/playlist.xml?command=pl_next
// http://127.0.0.1:8080/requests/playlist.xml?command=pl_play&id=7

const request = require('request');

const vlcAPI = function (username, password, command) {
	const options = {
		url: 'http://192.168.1.4:8080/requests/status.xml',
		qs: {
			command: command
		},
		auth: {
			username: username,
			password: password
		}
	};

	request.get(options, (err, res, body) => {
		if (err) {
			console.error(err);
		} else {
			console.log(body);
		}
	});
}

module.exports = {
	vlcAPI:vlcAPI
}
