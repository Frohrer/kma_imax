const http = require('http');
const xml2js = require('xml2js');

const getSections = async function (ipAddress, plexToken) {
	const options = {
		hostname: ipAddress,
		port: 32400,
		path: '/library/sections/',
		headers: {
			'X-Plex-Token': plexToken
		}
	};

	http.get(options, res => {
		let data = '';

		res.on('data', chunk => {
			data += chunk;
		});

		res.on('end', () => {
			xml2js.parseString(data, (err, result) => {
				if (err) {
					console.error(err);
				} else {
					console.log(result.MediaContainer.Directory);
					return result.MediaContainer.Directory
				}
			});
		});
	});
}

const getPlaylistItems = async function (ipAddress, playlistId, plexToken) {
	const options = {
		hostname: ipAddress,
		port: 32400,
		path: `/playlists/${playlistId}/items`,
		headers: {
			'X-Plex-Token': plexToken
		}
	};

	http.get(options, res => {
		let data = '';

		res.on('data', chunk => {
			data += chunk;
		});

		res.on('end', () => {
			xml2js.parseString(data, (err, result) => {
				if (err) {
					console.error(err);
				} else {
					console.log(result.MediaContainer.Video[0]);
					return result.MediaContainer.Video
				}
			});
		});
	});
}


module.exports = {
	getSections:getSections,
	getPlaylistItems:getPlaylistItems
}
