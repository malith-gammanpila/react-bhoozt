/**
 * Store user details and initial headers for the application
 */
const setUserDefault = async (data) => {
	try {
		localStorage.setItem('bhooztUser', JSON.stringify(data));
	} catch (e) {
		console.log('Error on creating userDefaults', e);
	}
};

/**
 * Store user confirmation details
 */
const setUserConfirm = async (data) => {
	try {
		localStorage.setItem('bhooztConfirm', JSON.stringify(data));
	} catch (e) {
		console.log('Error on creating userConfirm', e);
	}
};

/**
 * Store initial headers for the application
 */
const setBhooztHeaders = async (headers) => {
	try {
		let localHeaders = {
			'access-token': headers['access-token'],
			client: headers['client'],
			uid: headers['uid'],
			'Content-Type': 'application/json',
		};

		localStorage.setItem('bhooztHeaders', JSON.stringify(localHeaders));
	} catch (e) {
		console.log('Error on creating headers', e);
	}
};
/**
 * Store ano-user device info and response for the application
 */
const setAnoUserDefault = async (data, uniqueId) => {
	try {
		data['device_unique_id'] = uniqueId;
		localStorage.setItem('bhooztUser', JSON.stringify(data));
	} catch (e) {
		console.log('Error on creating userDefaults', e);
	}
};

/**
 * Store user games for the application
 */
const setUserGames = async (data) => {
	try {
		localStorage.setItem('userGames', JSON.stringify(data));
	} catch (e) {
		console.log('Error on creating userGames', e);
	}
};

/**
 * Store tickers for the application
 */
const setTickers = async (data) => {
	try {
		localStorage.setItem('bhooztTickers', JSON.stringify(data));
	} catch (e) {
		console.log('Error on creating tickers', e);
	}
};

/**
 * Store ads for the application
 */
const setAds = async (data) => {
	try {
		localStorage.setItem('bhooztAds', JSON.stringify(data));
	} catch (e) {
		console.log('Error on creating tickers', e);
	}
};

/**
 * Store settings for the application
 */
const setBhooztSettings = async (data) => {
	try {
		localStorage.setItem('bhooztSettings', JSON.stringify(data));
	} catch (e) {
		console.log('Error on creating tickers', e);
	}
};

/**
 * Store coin value
 */
const setCoinValue = async (value) => {
	try {
		localStorage.setItem('bhooztCoinValue', value);
	} catch (e) {
		console.log('Error on creating tickers', e);
	}
};

/**
 * Firebase token
 */
const setFCMToken = async (value) => {
	try {
		localStorage.setItem('FCMToken', value);
	} catch (e) {
		console.log('Error on creating FCMToken', e);
	}
};

/**
 * Store Tutorial Screen
 */
const setTutorials = (value) => {
	try {
		localStorage.setItem('tutorialScreen', JSON.stringify(value));
	} catch (e) {
		console.log('Error on creating Tutorials', e);
	}
};

// --------------------------------Getters--------------------------------
/**
 * Get user from local storage data
 */
const userDefaults = async () => {
	return JSON.parse(localStorage.getItem('bhooztUser'));
};

/**
 * Get user confirmation details
 */
const userConfirm = async () => {
	return JSON.parse(localStorage.getItem('bhooztConfirm'));
};

/**
 * Get headers from local storage data
 */
const bhooztHeaders = async () => {
	return JSON.parse(localStorage.getItem('bhooztHeaders'));
};

/**
 * Get user games from local storage data
 */
const userGames = async () => {
	return JSON.parse(localStorage.getItem('userGames'));
};

/**
 * Get tickers from local storage data
 */
const bhooztTickers = async () => {
	let user = await userDefaults();
	let tickers = JSON.parse(localStorage.getItem('bhooztTickers'));

	if (user && user.user_role === 'anonymous') {
		tickers !== null &&
			tickers.unshift({
				id: -1,
				created_at: '2018-12-20T09:30:19.905Z',
				published: true,
				text: 'Welcome to Bhoozt App',
			});
	} else {
		tickers !== null &&
			tickers.unshift({
				id: -1,
				created_at: '2018-12-20T09:30:19.905Z',
				published: true,
				text: 'Hello ' + user.name,
			});
	}
	return tickers;
};

/**
 * Get tickers from local storage data
 */
const bhooztAds = async () => {
	return JSON.parse(localStorage.getItem('bhooztAds'));
};

/**
 * Get tickers from local storage data
 */
const bhooztSettings = async () => {
	return JSON.parse(localStorage.getItem('bhooztSettings'));
};

/**
 * Get  coin value
 */
const coinValue = async () => {
	return localStorage.getItem('bhooztCoinValue');
};

/**
 * Get  coin value
 */
const FCMToken = async () => {
	return localStorage.getItem('FCMToken');
};

/**
 * Get  Tutorial value
 */
const tutotials = () => {
	return JSON.parse(localStorage.getItem('tutorialScreen'));
};

/**
 * Clear all local storage data
 */
const clearDefaults = async () => {
	const tutorialData = tutotials();
	setTimeout(() => {
		localStorage.clear();
	}, 500);
	setTimeout(() => {
		setTutorials(tutorialData);
	}, 1000);
};

export {
	setUserDefault,
	setUserConfirm,
	clearDefaults,
	userDefaults,
	userConfirm,
	bhooztHeaders,
	setAnoUserDefault,
	setBhooztHeaders,
	setUserGames,
	setTickers,
	userGames,
	bhooztTickers,
	bhooztAds,
	setAds,
	setBhooztSettings,
	bhooztSettings,
	setCoinValue,
	coinValue,
	FCMToken,
	setFCMToken,
	setTutorials,
	tutotials,
};
