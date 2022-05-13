import { Request, RequestUnhandled } from '../requestHandler.api';
import {
	bhooztHeaders,
	userDefaults,
	FCMToken,
	setFCMToken,
} from '../../database/bhoozt_defaults.data';

/**
 * API call to add firebase token
 */
const BhooztFirebaseRegistration = async (token) => {
	try {
		let headers = await bhooztHeaders();
		let user = await userDefaults();
		const res = await Request.post(
			'/device/firebase',
			{
				firebase_token: token,
				device_id: user.email,
			},
			{
				headers: headers,
			}
		);

		await setFCMToken(token);

		// console.log('FCM Registration', res); // DEBUG

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

/**
 * API call to remove firebase token
 */
const BhooztFirebaseUnRegistration = async () => {
	try {
		let headers = await bhooztHeaders();
		let user = await userDefaults();
		let token = await FCMToken();
		const res = await RequestUnhandled.post(
			'/device/firebase/unregister',
			{
				firebase_token: token,
				device_id: user.email,
			},
			{
				headers: headers,
			}
		);

		console.log('FCM Un-Registration', res);
		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

export { BhooztFirebaseRegistration, BhooztFirebaseUnRegistration };
