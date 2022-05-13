import { useState } from 'react';
import messages from './messages.container';
import {
	CreateAnonymousUser,
	SignIn,
	SocialLogin,
} from '../api/calls/user.api';
import useRoute from '../hooks/route.hook';
import NetworkContainer from './network.container';
import {
	clearDefaults,
	FCMToken,
	userDefaults,
} from '../database/bhoozt_defaults.data';
import { BhooztFirebaseUnRegistration } from '../api/calls/push.api';
import { messaging } from '../push-notification';
import AnalyticContainer from './analytic.container';

const useLogin = () => {
	const [isBusy, setIsBusy] = useState(false);
	const [data, setData] = useState({});

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalType, setModalType] = useState('');

	const { notifyError, notifySuccess, notifyProgress } = messages();
	const { handleRedirect } = useRoute();
	const { isOnline } = NetworkContainer.useContainer();
	const { mpUserInit } = AnalyticContainer.useContainer();

	const handleChange = ({ currentTarget: input }) => {
		setData((pre) => ({ ...data, [input.name]: input.value }));
	};

	const handleCloseModal = () =>
		isModalVisible ? setIsModalVisible(false) : null;
	const handleOpenRegisterModal = () => {
		setModalType('register');
		setIsModalVisible(true);
	};
	const openProfileModal = () => {
		setModalType('profile');
		setIsModalVisible(true);
	};

	const login = async () => {
		setIsBusy(true);
		let response = await SignIn(data.email, data.password);
		let result = false;
		setIsBusy(false);

		if (response[1].status > 300) {
			notifyError(
				response[1] !== undefined ? response[1].data.message : 'Error'
			);
			// response[1] !== undefined ? response[1].message : 'err'
		} else {
			mpUserInit(response[1]);
			result = true;
			setTimeout(function () {
				notifySuccess('Hello ' + response[1].name);
			}, 500);
		}

		return result;
	};

	const loginAsAnonymous = async (inviteToken) => {
		setIsBusy(true);
		let response = await CreateAnonymousUser(inviteToken);
		let result = false;

		if (response[0] > 300) {
			// notifyError(response[1].message);
		} else {
			mpUserInit(response[1]);
			result = true;
			setTimeout(function () {
				notifySuccess('Welcome to Bhoozt App');
			}, 500);
		}
		setIsBusy(false);
		return result;
	};

	const handleSubmit = async (e) => {
		if (isOnline) {
			setIsBusy(true);
			e.preventDefault();
			if (data.email && data.password) {
				notifyProgress('Please wait...');
				let result = await login();
				if (result) {
					setTimeout(function () {
						handleRedirect(`/`);
					}, 3500);
				} else {
					// notifyError('Invalid login credentials. Please try again');
				}
			} else {
				notifyError('Please fill both email and password');
			}
			setIsBusy(false);
		} else {
			notifyError('Please check your internet connection');
		}
	};

	const handleSubmitAnonymousUser = async (e, inviteToken) => {
		if (isOnline) {
			setIsBusy(true);
			if (e && e !== null) {
				e.preventDefault();
			}
			notifyProgress('Please wait...');
			let result = await loginAsAnonymous(inviteToken);
			if (result) {
				setTimeout(function () {
					handleRedirect(`/`);
				}, 3500);
			}
			setIsBusy(false);
		} else {
			notifyError('Please check your internet connection');
		}
	};

	const socialLogin = async (type, data) => {
		if (isOnline) {
			notifyProgress('Please wait...');
			let [code, res] = [];
			if (type === 'facebook') {
				let fname = '';
				let lname = '';
				if (data.name && data.name.split(' ').length > 1) {
					fname = data.name.split(' ')[0];
					lname = data.name.split(' ')[1];
				} else {
					fname = data.first_name ? data.first_name : '';
					lname = data.last_name ? data.last_name : '';
				}

				[code, res] = await SocialLogin(
					{
						id: data.id,
						email: data.email ? data.email : null,
						sex: data.gender ? data.gender : 'male',
						socialImage:
							data.picture && data.picture.data
								? data.picture.data.url
								: null,
						first_name: fname,
						last_name: lname,
					},
					type
				);
			} else {
				if (data && data.profileObj) {
					let user = data.profileObj;
					[code, res] = await SocialLogin(
						{
							id: data.googleId,
							email: user.email ? user.email : null,
							sex: 'male',
							socialImage: user.imageUrl ? user.imageUrl : null,
							first_name:
								user.name && user.name.split(' ').length > 1
									? user.name.split(' ')[0]
									: data.name,
							last_name:
								user.name && user.name.split(' ').length > 1
									? user.name.split(' ')[1]
									: null,
						},
						type
					);
				}
			}

			if (code === 200) {
				// console.log(res); // DEBUG
				notifySuccess('Hello ' + res.content.user.name);
				setTimeout(function () {
					handleRedirect(`/`);
				}, 3500);
			} else if (code !== 503 || code !== 403) {
				notifyError(
					res.data && res.data.message
						? res.data.message
						: 'Email address already available with normal login'
				);
			}
		} else {
			notifyError('Please check your internet connection');
		}
	};

	const handleLogout = async () => {
		let user = await userDefaults();
		let token = await FCMToken();
		if (user) {
			try {
				if (token && token.length > 0) {
					await BhooztFirebaseUnRegistration();
					await messaging.deleteToken(token);
				}
			} catch (e) {
				// console.log(e);
			}
			await clearDefaults();
			handleRedirect('/');
		}
	};

	return {
		isBusy,
		setIsBusy,
		data,
		isModalVisible,
		handleCloseModal,
		modalType,
		handleOpenRegisterModal,
		openProfileModal,
		handleChange,
		handleSubmit,
		handleSubmitAnonymousUser,
		socialLogin,
		handleLogout,
	};
};

export default useLogin;
