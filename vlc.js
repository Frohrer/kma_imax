
// http://127.0.0.1:8080/requests/status.xml?command=pl_stop
// http://127.0.0.1:8080/requests/playlist.xml?command=pl_next
// http://127.0.0.1:8080/requests/playlist.xml?command=pl_play&id=7

const request = require('request');
const xml2js = require('xml2js');
require('dotenv').config();

function generateRandomNumber(n) {
	return Math.floor(Math.random() * n) + 1;
}


const vlcAPI = function (username, password, command) {
	return new Promise((resolve,reject) => {
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
				xml2js.parseString(body, {preserveChildrenOrder:true}, (err, result) => {
					if (err) {
						console.error(err);
					} else {
						try {
							resolve(result.root.information[0].category[0].info[1]._)
						} catch (e) {
							resolve('Unknown')
						}
					}
				});
			}
		});
	})
}

const vlcGetCurrent = function (username, password) {
	return new Promise((resolve,reject) => {
		const options = {
			url: `http://${process.env.VLC_IP}/requests/status.xml`,
			auth: {
				username: username,
				password: password
			}
		};

		request.get(options, (err, res, body) => {
			if (err) {
				console.error(err);
			} else {
				// console.log(body);
				xml2js.parseString(body, {preserveChildrenOrder:true}, (err, result) => {
					if (err) {
						console.error(err);
					} else {
						try {
							let items = result.root.information[0].category[0].info
							for (let i = 0; i < items.length; i++) {
								if (items[i].$.name == 'filename') {
									console.log(`Currently playing ${items[i]._}.`);
									resolve(items[i]._)
								}
								// if (items[i].$.name == 'title') {
								// 	console.log(items[i]._);
								// }
							}
						} catch (e) {
							resolve('Unknown')
						}
					}
				});
			}
		});
	})
}

const getRunStatus = function (username, password) {
	return new Promise((resolve,reject) => {
		const options = {
			url: `http://${process.env.VLC_IP}/requests/status.xml`,
			auth: {
				username: username,
				password: password
			}
		};

		request.get(options, (err, res, body) => {
			if (err) {
				console.error(err);
			} else {
				xml2js.parseString(body, {preserveChildrenOrder:true}, (err, result) => {
					if (err) {
						console.error(err);
					} else {
						try {
							resolve({
								position:result.root.position[0],
								length:result.root.length[0]
							})
						} catch (e) {
							resolve('Unknown')
						}
					}
				});
			}
		});
	})
}

const runAd = function (username, password) {
	return new Promise((resolve,reject) => {
		let randomNumber = generateRandomNumber(process.env.VLC_AD_AMOUNT);
		const options = {
			url: `http://${process.env.VLC_IP}/requests/status.xml?command=in_play&input=${process.env.VLC_AD_FOLDER}${randomNumber}.mp4`,
			auth: {
				username: username,
				password: password
			}
		};

		request.get(options, (err, res, body) => {
			if (err) {
				console.error(err);
			} else {
				xml2js.parseString(body, {preserveChildrenOrder:true}, (err, result) => {
					if (err) {
						console.error(err);
					} else {
						try {
							resolve(result.root.length[0])
						} catch (e) {
							resolve('Unknown')
						}
					}
				});
			}
		});
	})
}

const runContent = function (username, password) {
	return new Promise((resolve,reject) => {
		let randomNumber = generateRandomNumber(process.env.VLC_AD_AMOUNT);
		const options = {
			url: `http://${process.env.VLC_IP}/requests/status.xml?command=in_play&input=${process.env.VLC_CONTENT_FOLDER}`,
			auth: {
				username: username,
				password: password
			}
		};

		request.get(options, (err, res, body) => {
			if (err) {
				console.error(err);
			} else {
				xml2js.parseString(body, {preserveChildrenOrder:true}, (err, result) => {
					if (err) {
						console.error(err);
					} else {
						try {
							resolve(result.root.length[0])
						} catch (e) {
							resolve('Unknown')
						}
					}
				});
			}
		});
	})
}

module.exports = {
	vlcAPI:vlcAPI,
	vlcGetCurrent:vlcGetCurrent,
	vlcGetRunStatus:getRunStatus,
	vlcRunAd:runAd,
	vlcRunContent:runContent,
}
