import { RequestUnhandled } from '../requestHandler.api';
import { bhooztHeaders } from '../../database/bhoozt_defaults.data';

/**
 * API call for ad click
 */
const AdClick = async adId => {
	try {
		let headers = await bhooztHeaders();
		const res = await RequestUnhandled.post(
			'/quotes/' + adId + '/click',
			{},
			{
				headers: headers,
			}
		);

		return [res.status, res.data.status];
	} catch (e) {
		return [e.response.status, e.response.data];
	}
};

/**
 * API call to record application usage count
 */
const AppUsage = async adId => {
	try {
		let headers = await bhooztHeaders();
		const res = await RequestUnhandled.post(
			'/app/usage',
			{},
			{
				headers: headers,
			}
		);

		return [res.status, res.data.status];
	} catch (e) {
		return [e.response.status, e.response.data];
	}
};

/**
 * API call to record application usage count
 * time need to be in format of ()
 */
const GamePlayTime = async (gameId, startTime, endTime) => {
	try {
		let headers = await bhooztHeaders();
		const res = await RequestUnhandled.post(
			'/game/' + gameId + '/playtime',
			{
				s_time: startTime,
				e_time: endTime,
			},
			{
				headers: headers,
			}
		);

		return [res.status, res.data.status];
	} catch (e) {
		return [e.response.status, e.response.data];
	}
};

/**
 * API call for game click
 */
const GameClick = async gameId => {
	try {
		let headers = await bhooztHeaders();
		const res = await RequestUnhandled.post(
			'/game/' + gameId + '/click',
			{},
			{
				headers: headers,
			}
		);

		return [res.status, res.data.status];
	} catch (e) {
		return [e.response.status, e.response.data];
	}
};

/**
 * API call for game click
 */
const AdImpressions = async impressionPattern => {
	try {
		let headers = await bhooztHeaders();
		const res = await RequestUnhandled.post(
			'/quotes/impressions',
			{
				pattern: impressionPattern,
			},
			{
				headers: headers,
			}
		);

		return [res.status, res.data.status];
	} catch (e) {
		throw e;
		// return [e.response.status, e.response.data];
	}
};

export { AdClick, AppUsage, GamePlayTime, GameClick, AdImpressions };
