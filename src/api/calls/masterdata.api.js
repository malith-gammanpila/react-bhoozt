import { Request } from '../requestHandler.api';
import {
	bhooztHeaders,
	setAds,
	setBhooztSettings,
	setCoinValue,
	setTickers,
	setUserDefault,
	setUserGames,
	userDefaults,
	setTutorials,
	tutotials,
} from '../../database/bhoozt_defaults.data';

/**
 * Master data sync -> user profile, games, tickers, ads, settings
 */
const MasterData = async () => {
	try {
		let user = await userDefaults();
		let headers = await bhooztHeaders();

		const resUser = await Request.get('/user/details?id=' + user.id, {
			headers: headers,
		});

		const resUserGames = await Request.get('/user/' + user.id + '/games', {
			headers: headers,
		});

		const resTickers = await Request.get('/tickers/all', {
			headers: headers,
		});

		const resAds = await Request.get('/quotes/all', {
			headers: headers,
		});

		const resSettings = await Request.get('/mobile/settings', {
			headers: headers,
		});

		const resCoinValue = await Request.get('/payment/coin/value');

		resUser.data.content
			? await setUserDefault(resUser.data.content.user)
			: await setUserDefault(null);
		resUserGames.data.content
			? await setUserGames(resUserGames.data.content.games)
			: await setUserGames(null);
		resTickers.data.content
			? await setTickers(resTickers.data.content.tickers)
			: await setTickers(null);
		resAds.data.content
			? await setAds(resAds.data.content.advertisements)
			: await setAds(null);
		resSettings.data.content
			? await setBhooztSettings(resSettings.data.content.settings)
			: await setBhooztSettings(null);
		resCoinValue.data.content
			? await setCoinValue(resCoinValue.data.content.coin.coin_value)
			: await setCoinValue(0);

		return [200, 'Successfully stored master data'];
	} catch (e) {
		console.log(e);
		// return [e.response.status, e.response.data];
	}
};

const TutorialScreens = () => {
	const tutorialData = tutotials();
	if (!tutorialData) {
		setTutorials(['bhooztme', 'publicgame', 'privategame']);
	}
};

export { MasterData, TutorialScreens };
