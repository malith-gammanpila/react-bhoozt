import { useEffect, useState } from 'react';
import { userDefaults, userConfirm } from '../database/bhoozt_defaults.data';
import { createContainer } from 'unstated-next';
import OtpContainer from './otp.container';
import HomeContainer from './home.container';
import { ConfirmationStatus } from '../api/calls/user.api';
import messages from './messages.container';

const useProfile = () => {
	const {
		defaultDataUpdated,
		setDefaultDataUpdated,
	} = OtpContainer.useContainer();
	const { user } = HomeContainer.useContainer();
	const {
		notifyError,
		notifyLongError,
		notifySuccess,
		notifyProgress,
	} = messages();

	const [profile, setProfile] = useState({});
	const [isUpdated, setIsUpdated] = useState(false);
	const [isBusy, setIsBusy] = useState(false);

	const [confirmationData, setConfirmationData] = useState({
		is_email_confirmed: false,
		is_email_change_requested: false,
		is_otp_confirmed: true,
		is_phone_change_requested: false,
		is_paypal_confirmed: false,
		is_paypal_change_requested: false,
	});

	useEffect(() => {
		if (isUpdated || defaultDataUpdated === false) {
			getUserData();
		}
	}, [isUpdated, defaultDataUpdated]);

	useEffect(() => {
		getUserData();
	}, []);

	const getUserData = async () => {
		const user = await userDefaults();
		if (user) {
			setProfile(user);
			setIsUpdated(false);
			setDefaultDataUpdated(true);
		}
	};

	const checkConfirmation = async () => {
		if (user && user.id) {
			let [code, res] = await ConfirmationStatus(user.id);

			if (code === 200) {
				let res = await userConfirm();
				if (res) {
					setConfirmationData(res);
					return true;
				} else {
					notifyError('Something went wrong.');
					return false;
				}
			} else {
				notifyError(res);
				return false;
			}
		}
	};

	return {
		profile,
		getUserData,
		isUpdated,
		setIsUpdated,
		checkConfirmation,
		confirmationData,
		isBusy,
		setIsBusy,
	};
};

const profileContainer = createContainer(useProfile);

export default profileContainer;
