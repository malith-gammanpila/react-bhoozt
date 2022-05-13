import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import {
	NotificationHistory,
	ReadNotification,
} from '../api/calls/notification.api';
import { AcceptCoins } from '../api/calls/forward.api';
import { userDefaults } from '../database/bhoozt_defaults.data';
import messages from './messages.container';
import HomeContainer from './home.container';
import AnalyticContainer from './analytic.container';

const useNotification = () => {
	const {
		mpReadNotification,
		mpSetNotoficationCount,
	} = AnalyticContainer.useContainer();
	const { setUser } = HomeContainer.useContainer();
	const [notificationHistory, setNotificationHistory] = useState([]);
	const [newCount, setNewCount] = useState(0);
	const { notifyError, notifySuccess } = messages();

	useEffect(() => {
		fetchNotificationHistory();
	}, []);

	useEffect(() => {
		// Mixpanel analytics
		mpSetNotoficationCount(notificationHistory.length, newCount);
	}, [newCount]);

	const fetchNotificationHistory = async () => {
		const [code, response] = await NotificationHistory();
		if (code >= 300) {
			// notifyError('Something went wrong');
		} else {
			if (response !== undefined && response !== null) {
				setNotificationHistory(response.notifications);
				setNewCount(response.new_count);
			}
		}
	};

	const handleClick = async (notificationId, type) => {
		const notifications = [...notificationHistory];

		const [code, status, messages] = await ReadNotification(notificationId);
		if (code >= 300) {
			// notifyError(messages);
		} else {
			if (status === 1) {
				const index = notifications.findIndex(
					(n) => n.notification_id === notificationId
				);

				if (!notifications[index].is_read) {
					// Mixpanel analytics
					mpReadNotification(
						notificationId,
						notifications[index].type
					);
				}

				notifications[index].is_read = true;
				setNotificationHistory(notifications);
				setNewCount(newCount - 1);
			}
		}
	};

	const handleSayThanks = async (transactionKey) => {
		const [code, response] = await AcceptCoins(transactionKey);
		// notifyProgress('Processing...');
		if (code >= 300) {
			setTimeout(() => {
				notifyError(response.message);
			}, 3000);
		} else if (code === 200) {
			notifySuccess(response.message);
		}
		fetchNotificationHistory();
		let user = await userDefaults();
		setUser(user);
	};

	return {
		notificationHistory,
		newCount,
		handleClick,
		fetchNotificationHistory,
		handleSayThanks,
	};
};

const NotifiContainer = createContainer(useNotification);

export default NotifiContainer;
