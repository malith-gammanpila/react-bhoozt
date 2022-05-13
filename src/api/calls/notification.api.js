import { RequestUnhandled } from '../requestHandler.api';
import { bhooztHeaders } from '../../database/bhoozt_defaults.data';

/**
 * API call to get application notification history
 */
const NotificationHistory = async () => {
	try {
		let headers = await bhooztHeaders();
		const res = await RequestUnhandled.get('/notification/history/', {
			headers: headers,
		});

		return [res.status, res.data.content];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

/**
 * API call to set all notifications read
 */
const ReadNotifications = async () => {
	try {
		let headers = await bhooztHeaders();
		const res = await RequestUnhandled.get('/notification/update/all', {
			headers: headers,
		});

		return [res.status, res.data.status, res.data.message];
	} catch (e) {
		return e && e.response
			? [e.response.status, 0, e.response.data]
			: [400, 0, 'Error'];
	}
};

/**
 * API call to notification read
 */
const ReadNotification = async notification => {
	try {
		let headers = await bhooztHeaders();
		const res = await RequestUnhandled.post(
			'/notification/update',
			{
				notification_id: notification,
			},
			{
				headers: headers,
			}
		);

		return [res.status, res.data.status, res.data.message];
	} catch (e) {
		return e && e.response
			? [e.response.status, 0, e.response.data]
			: [400, 0, 'Error'];
	}
};

export { NotificationHistory, ReadNotifications, ReadNotification };
