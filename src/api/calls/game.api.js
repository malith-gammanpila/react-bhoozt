import { Request } from '../requestHandler.api';
import {
	bhooztHeaders,
	userDefaults,
	setUserDefault,
} from '../../database/bhoozt_defaults.data';

/**
 * API call for bhoozt tap
 * please refer the data format from api docs
 */
const BhooztMe = async () => {
	try {
		let user = await userDefaults();
		let headers = await bhooztHeaders();
		const res = await Request.get('/game/bhooztme/' + user.id, {
			headers: headers,
		});

		return [res.status, res.data.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, 0, e.response.data]
			: [400, 0, 'Error'];
	}
};

/**
 * API call for bhoozt tap private
 * please refer the data format from api docs
 * @param {number} id game id
 */
const BhooztMePrivate = async (id) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.get('/game/private/bhooztme?game_id=' + id, {
			headers: headers,
		});
		return [res.status, res.data.status, res.data.content];
	} catch (e) {
		return e && e.response
			? [e.response.status, 0, e.response.data]
			: [400, 0, 'Error'];
	}
};

/**
 * API call for update game pattern
 * please refer the data format from api docs
 */
const UpdateGamePattern = async (gameId, pattern) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.post(
			'/game/pattern/update',
			{
				pattern: pattern,
				game_id: gameId,
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
 * API call for get game details
 * please refer the data format from api docs
 */
const GameDetails = async (gameId) => {
	try {
		let headers = await bhooztHeaders();
		let user = await userDefaults();

		const res = await Request.get('/game/' + gameId, {
			headers: headers,
		});

		const cloneuser = { ...user };
		cloneuser.available_coins = `${res.data.content.game.player_total_coins}`;
		setUserDefault(cloneuser);

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

/**
 * API call to add private game
 */
const AddPrivateGame = async (token, usedMethod) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.put(
			'/game/request',
			{
				game_token: token,
				used_method: usedMethod,
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
 * API call to add invited private game
 */
const AddInvitedPvtGame = async (token) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.put(
			'game/invite/accept',
			{
				invite_token: token,
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
 * API call to add invited private game
 */
const AddInvitedPvtGrowthGame = async (token, ref) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.put(
			'game/invite/accept',
			{
				invite_token: token,
				ref: ref,
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
 * API call to create private game invitation
 */
const CreatePvtGameInvitation = async (gameId) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.post(
			'game/invite',
			{
				game_id: gameId,
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
 * API call get game list
 */
const GameList = async (user) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.get('/user/' + user.id + '/games', {
			headers: headers,
		});
		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

export {
	BhooztMe,
	GameDetails,
	UpdateGamePattern,
	AddPrivateGame,
	AddInvitedPvtGame,
	AddInvitedPvtGrowthGame,
	CreatePvtGameInvitation,
	BhooztMePrivate,
	GameList,
};
