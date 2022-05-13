import { Request } from '../requestHandler.api';
import {
	bhooztHeaders,
	setUserDefault,
} from '../../database/bhoozt_defaults.data';

/**
 * API call to get all users
 */
const AllUsers = async () => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.get('/friend/pool', {
			headers: headers,
		});

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

/**
 * API call to search users by name
 */
const SearchUsers = async (name) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.get('/friend/search', {
			headers: headers,
			params: { name: name },
		});

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

/**
 * API call to get all friends
 */
const AllFriends = async () => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.get('/friend/all', {
			headers: headers,
		});

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

/**
 * API call to get updates
 */
const Updates = async () => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.get('/friend/requests', {
			headers: headers,
		});

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

/**
 * API call to send a friend request
 */
const AddFriend = async (id) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.post(
			'/friend/add',
			{
				friend_id: id,
			},
			{
				headers: headers,
			}
		);

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

/**
 * API call to remove a friend
 */
const RemoveFriend = async (id) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.delete('/friend/remove', {
			headers: headers,
			params: {
				friend_id: id,
			},
		});

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

/**
 * API call to accept a friend
 */
const AcceptFriend = async (id) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.put(
			'/friend/accept',
			{
				friend_id: id,
			},
			{ headers: headers }
		);

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

export {
	AllUsers,
	SearchUsers,
	AllFriends,
	Updates,
	AddFriend,
	AcceptFriend,
	RemoveFriend,
};
