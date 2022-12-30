
// http://127.0.0.1:8080/requests/status.xml?command=pl_stop
// http://127.0.0.1:8080/requests/playlist.xml?command=pl_next
// http://127.0.0.1:8080/requests/playlist.xml?command=pl_play&id=7

const request = require('request');
const xml2js = require('xml2js');
require('dotenv').config();

const vlcAPI = function (username, password, command) {
	const options = {
		url: `http://${process.env.VLC_IP}/requests/status.xml?command=${command}`,
		auth: {
			username: username,
			password: password
		}
	};

	request.get(options, (err, res, body) => {
		if (err) {
			console.error(err);
		} else {
			xml2js.parseString(body, (err, result) => {
				if (err) {
					console.error(err);
				} else {
					console.log(`Currently playing ${result.root.information[0].category[0].info[1]._}.`);
				}
			});
		}
	});
}

module.exports = {
	vlcAPI:vlcAPI
}
