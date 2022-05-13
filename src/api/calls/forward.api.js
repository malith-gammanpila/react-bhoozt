import { Request } from '../requestHandler.api';
import {
	bhooztHeaders,
	setUserDefault,
} from '../../database/bhoozt_defaults.data';

/**
 * API call to get maximum available users
 */
const MaxUsers = async (coins) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.get('/coins/max', {
			headers: headers,
			params: { coins: coins },
		});

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

const DistributeCoins = async (coins, users) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.post(
			'/coins/transfer',
			{
				coins: coins,
				number_of_users: users,
			},
			{
				headers: headers,
			}
		);

		await setUserDefault(res.data.content.user);

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};
const AcceptCoins = async (transactionKey) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.post(
			'/coins/accept',
			{
				transaction_key: transactionKey,
			},
			{
				headers: headers,
			}
		);

		await setUserDefault(res.data.content.user);

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

export { MaxUsers, DistributeCoins, AcceptCoins };
