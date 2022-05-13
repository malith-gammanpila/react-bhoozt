import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import { ProfileDetails } from '../api/calls/user.api';
import { AddReferralCode } from '../api/calls/referral.api';
import messages from './messages.container';
import NotifiContainer from './notification.container';

const usePush = () => {
	const { handleSayThanks } = NotifiContainer.useContainer();
	const { notifyError, notifySuccess } = messages();
	const [pushData, setPushData] = useState(null);

	useEffect(() => {
		console.log('PUSH DATA');
		console.log(pushData);
	}, [pushData]);

	/**
	 * Method to clear container data
	 */
	const handleClearPushData = () => {
		setPushData(null);
	};

	/**
	 * Method to clear container data
	 */
	const getUserDetails = async () => {
		const [code, res] = await ProfileDetails();
		return [code, res];
	};

	/**
	 * Method to handle push message data
	 * @param {Object} data Data from firebase
	 */
	const handleMsgData = (data) => {
		// common data
		let type = data['firebase-messaging-msg-data'].data.typ || null;
		let title =
			data['firebase-messaging-msg-data'].notification.title || null;
		let body =
			data['firebase-messaging-msg-data'].notification.body || null;

		// if instant prize
		let gameId = data['firebase-messaging-msg-data'].data.G || null;
		let coins = data['firebase-messaging-msg-data'].data.C || null;
		let notificationId = data['firebase-messaging-msg-data'].data.N || null;

		// if circle
		// nothing to do

		// if new geo game
		let gameCode = data['firebase-messaging-msg-data'].data.GC || null;

		// if coin dist received
		let sender = data['firebase-messaging-msg-data'].data.S || null;
		let transactionKey = data['firebase-messaging-msg-data'].data.K || null;

		// if coin dist accepted
		let receiversFName = data['firebase-messaging-msg-data'].data.U || null;
		let karmaPoints = data['firebase-messaging-msg-data'].data.KK || null;

		// if coin dist rolled-back
		let rolledBackCoins =
			data['firebase-messaging-msg-data'].data.RC || null;
		let availableCoins =
			data['firebase-messaging-msg-data'].data.AC || null;

		let t = data['firebase-messaging-msg-data'].notification.title || '';
		let b = data['firebase-messaging-msg-data'].notification.body || '';
		let g = data['firebase-messaging-msg-data'].data.G || '';
		let s = data['firebase-messaging-msg-data'].data.S || '';
		let c = data['firebase-messaging-msg-data'].data.C || '';
		let n = data['firebase-messaging-msg-data'].data.N || '';
		setPushData({
			type,
			title,
			body,
			gameId,
			coins,
			notificationId,
			gameCode,
			sender,
			transactionKey,
			receiversFName,
			karmaPoints,
			rolledBackCoins,
			availableCoins,
			t,
			b,
			g,
			s,
			c,
			n,
		});
	};

	const handleAddReferralCode = async (referralCode) => {
		const [status, data] = await AddReferralCode(referralCode);

		if (status >= 300) {
			notifyError(
				data && data.message !== undefined && data.message.length > 0
					? data.message
					: 'Something went wrong'
			);
		} else {
			notifySuccess(
				data && data.message !== undefined && data.message.length > 0
					? data.message
					: 'Referral code added successfully'
			);
		}
	};

	const handleClickSayThanks = async (key) => {
		handleSayThanks(key);
	};

	return {
		pushData,
		setPushData,
		handleClearPushData,
		handleMsgData,
		getUserDetails,
		handleAddReferralCode,
		handleClickSayThanks,
	};
};

const PushContainer = createContainer(usePush);

export default PushContainer;
