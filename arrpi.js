const request = require('request');
require('dotenv').config();

const lookupMovie = function (term) {
	return new Promise((resolve,reject) => {
		const options = {
			url: `http://${process.env.RADAR_IP}:7878/api/v3/movie/lookup?term=${term}`,
			headers: {
				accept: '*/*',
				'X-Api-Key': process.env.RADAR_API_KEY
			}
		};

		request.get(options, (err, res, body) => {
			if (err) {
				console.error(err);
				resolve({title:'Unknown',overview:'None',remotePoster:'None'})
			} else {
				// console.log(body);
				try {
					body = JSON.parse(body)
					resolve(body[0])
				} catch (e) {
					resolve({title:'Unknown',overview:'None',remotePoster:'None'})
				}
			}
		});
	})
}

const lookupShow = function (term) {
	return new Promise((resolve,reject) => {
		const options = {
			url: `http://${process.env.SONAR_IP}:8989/api/v3/series/lookup?term=${term}`,
			headers: {
				accept: '*/*',
				'X-Api-Key': process.env.SONAR_API_KEY
			}
		};

		request.get(options, (err, res, body) => {
			if (err) {
				console.error(err);
				resolve({title:'Unknown',overview:'None',remotePoster:'None'})
			} else {
				try {
					body = JSON.parse(body)
					console.log(body[0]);
					resolve(body[0])
				} catch (e) {
					resolve({title:'Unknown',overview:'None',remotePoster:'None'})
				}
			}
		});
	})
}

function removeDots(str) {
	if (typeof str !== 'undefined') {
		return str.replace(/\./g, ' ');
	}
}


function splitOnNumber(str) {
	if (typeof str !== 'undefined') {
		return str.split(/(?<=\D)\d{4}/);
	}
}

function removeSpecialCharacters(str) {
	return str.replace(/[^\w\säöüÄÖÜàâäéèêëïîôœùûüÿçÀÂÄÉÈÊËÏÎÔŒÙÛÜŸÇ]/gi, '');
}

function convertHtmlCharRefs(str) {
	return str.replace(/&[\w#]+;/g, function(match) {
		return String.fromCharCode(match.replace(/[&;]/g, ''));
	});
}

function splitOnEpisode(str) {
	return str.split(/S\d{2}E\d{2}/);
}

function hasEpisode(str) {
	const pattern = /S\d{2}E\d{2}/;
	return pattern.test(str);
}


function cleanTerm(str) {
	if (typeof str !== 'undefined') {
		str = removeDots(str)
		str = convertHtmlCharRefs(str)
		str = removeSpecialCharacters(str)
		if (hasEpisode(str)){
			str = splitOnEpisode(str)
		} else {
			str = splitOnNumber(str)
		}
		if (str == '' || typeof str == 'undefined') {
			console.log(str);
		}
		return str[0]
	} else {
		return str
	}
}

const lookupTMDB = async function (term) {
	term = cleanTerm(term)
	if (term == '' || typeof term == 'undefined') {
		return {title:'Unknown',overview:'None',remotePoster:'None'}
	}
	let show = await lookupMovie(term)
	if (show == 'Unknown') {
		let movie = await lookupShow(term)
		if (movie == 'Unknown') {
			return {title:'Unknown',overview:'None',remotePoster:'None'}
		} else {
			if (typeof movie == 'undefined'){
				return {title:'Unknown',overview:'None',remotePoster:'None'}
			} else {
				return movie
			}
		}
	} else {
		if (typeof show == 'undefined'){
			return {title:'Unknown',overview:'None',remotePoster:'None'}
		} else {
			return show
		}
	}
	// lookupMovie(term)
}

module.exports = {
	lookupMovie:lookupMovie,
	lookupShow:lookupShow,
	lookupTMDB:lookupTMDB
}
