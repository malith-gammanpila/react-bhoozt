import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import messages from './messages.container';
import AnalyticContainer from './analytic.container';

import {
	AllUsers,
	SearchUsers,
	AllFriends,
	Updates,
	AddFriend,
	RemoveFriend,
	AcceptFriend,
} from '../api/calls/friends.api';

const useFriends = () => {
	const { notifyError, notifySuccess } = messages();
	const {
		mpSendFriendRequest,
		mpWithdrawFriendRequest,
		mpAcceptFriendRequest,
		mpSetFriendshipCount,
	} = AnalyticContainer.useContainer();

	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [friends, setFriends] = useState([]);
	const [updates, setUpdates] = useState([]);

	// Mixpanel analytics
	useEffect(() => {
		if (friends && updates && updates.received && updates.sent) {
			mpSetFriendshipCount(
				friends.length,
				updates.received.length,
				updates.sent.length
			);
		}
	}, [friends, updates]);

	const getAllUsers = async () => {
		const [code, response] = await AllUsers();
		if (code >= 300) {
			setTimeout(() => {
				notifyError(response.message);
			}, 3000);
		} else if (code === 200) {
			setUsers(
				response.content && response.content.friends
					? response.content.friends
					: []
			);
		}
	};

	const searchUsersByName = async (name) => {
		setLoading(true);
		const [code, response] = await SearchUsers(name);
		if (code >= 300) {
			setTimeout(() => {
				notifyError(response.message);
			}, 3000);
		} else if (code === 200) {
			setUsers(
				response.content && response.content.friends
					? response.content.friends
					: []
			);
		}
		setLoading(false);
	};

	const getAllFriends = async () => {
		const [code, response] = await AllFriends();
		if (code >= 300) {
			setTimeout(() => {
				notifyError(response.message);
			}, 3000);
		} else if (code === 200) {
			setFriends(
				response.content && response.content.friends
					? response.content.friends
					: []
			);
		}
	};

	const getUpdates = async () => {
		const [code, response] = await Updates();
		if (code >= 300) {
			setTimeout(() => {
				notifyError(response.message);
			}, 3000);
		} else if (code === 200) {
			setUpdates(
				response.content && response.content.requests
					? response.content.requests
					: []
			);
		}
	};

	const sendFriendRequest = async (user) => {
		const [code, response] = await AddFriend(user.id);
		if (code >= 300) {
			setTimeout(() => {
				notifyError(response.message);
			}, 3000);
		} else if (code === 200) {
			notifySuccess(response.message);

			//Mixpanel analytics
			mpSendFriendRequest();
		}
	};

	const removeFriend = async (id) => {
		let data = [...friends, updates];
		const [code, response] = await RemoveFriend(id);
		if (code >= 300) {
			setTimeout(() => {
				notifyError(response.message);
			}, 3000);
		} else if (code === 200) {
			notifySuccess(response.message);
			setFriends(
				response.content && response.content.friends
					? response.content.friends
					: []
			);

			// Mixpanel analytics
			mpWithdrawFriendRequest();
		}
	};

	const acceptFriend = async (id) => {
		const [code, response] = await AcceptFriend(id);
		if (code >= 300) {
			setTimeout(() => {
				notifyError(response.message);
			}, 3000);
		} else if (code === 200) {
			notifySuccess(response.message);
			setFriends(
				response.content && response.content.friends
					? response.content.friends
					: []
			);

			// Mixpanel analytics
			mpAcceptFriendRequest();
		}
	};

	return {
		loading,
		users,
		friends,
		updates,
		setLoading,
		setUsers,
		setFriends,
		setUpdates,
		getAllUsers,
		searchUsersByName,
		getAllFriends,
		getUpdates,
		sendFriendRequest,
		removeFriend,
		acceptFriend,
	};
};

const FriendsContainer = createContainer(useFriends);

export default FriendsContainer;
