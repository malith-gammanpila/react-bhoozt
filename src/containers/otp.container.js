import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import * as firebase from 'firebase';

import { PhoneNumberUpdate, VerifyMobile } from '../api/calls/user.api';
import messages from './messages.container';
import useRoute from '../hooks/route.hook';

const useOtp = () => {
	const { notifyError, notifySuccess, notifyProgress } = messages();
	const { handleRedirect } = useRoute();

	const [mobileVisible, setMobileVisible] = useState(false);
	const [otpVisible, setOtpVisible] = useState(false);
	const [recapVisible, setRecapVisible] = useState(true);
	const [isBusy, setIsBusy] = useState(false);
	const [userData, setUserData] = useState();
	const [verificationResult, setVerificationResult] = useState();
	const [otpError, setOtpError] = useState();
	const [disabled, setDisabled] = useState(false);

	// Get new user data in profile.container
	const [defaultDataUpdated, setDefaultDataUpdated] = useState(true);

	let payload = null;

	// useEffect(() => {
	// 	console.log('userData', userData);
	// }, [userData]);

	const handleSetUserData = (data) => {
		let user = {
			id: data.id,
			full_name: data.full_name,
			email: data.email,
			phoneNumber:
				data.contact_number && data.contact_number !== null
					? data.contact_number
					: '',
			countryCode:
				process.env.REACT_APP_CUSTOM_NODE_ENV === 'production' ||
				process.env.REACT_APP_CUSTOM_NODE_ENV === 'staging'
					? '+61'
					: '+94',
			localPhoneNumber:
				data.contact_number && data.contact_number !== null
					? data.contact_number.length < 13 &&
					  data.contact_number.substr(3, 1) !== '0'
						? `0${data.contact_number.substr(3)}`
						: data.contact_number.substr(3)
					: '',
			// localPhoneNumber: '',
		};
		setUserData(user);
	};

	const handleChange = ({ currentTarget: input }) => {
		setUserData((userData) => ({ ...userData, [input.name]: input.value }));
	};

	const updatePhoneNumber = async (e) => {
		setIsBusy(true);
		e.preventDefault();

		if (
			userData &&
			userData.localPhoneNumber &&
			userData.localPhoneNumber.length > 10
		) {
			notifyError('Invalid phone number');
			setIsBusy(false);
			return;
		}

		if (userData && userData.localPhoneNumber && userData.countryCode) {
			payload = {
				id: userData.id,
				email: userData.email,
				contact_number: `${userData.countryCode}${
					userData.localPhoneNumber &&
					userData.localPhoneNumber.length > 0 &&
					userData.localPhoneNumber.substring(0, 1) === '0'
						? userData.localPhoneNumber.substr(1)
						: userData.localPhoneNumber
				}`,
			};

			// 		notifyProgress('Please wait...');
			let [code, res] = await PhoneNumberUpdate(payload);

			if (code >= 300) {
				notifyError(
					res && res.message !== undefined && res.message.length > 0
						? res.message
						: 'Something went wrong'
				);
			} else {
				notifySuccess(
					res && res.message !== undefined && res.message.length > 0
						? res.message
						: 'Phone number updated successfully. Please verify your new phone number.'
				);

				if (res && res.content && res.content.user) {
					// NOTE show otp screen here
					setDefaultDataUpdated(false);
					setMobileVisible(false);
					setOtpVisible(true);
					setRecapVisible(true);
					handleRequestMobileVerification(
						payload && payload.contact_number
					);
				}
			}
		} else {
			notifyError('Please fill all required fields');
		}
		setIsBusy(false);
	};

	const handleRequestMobileVerification = async (phoneNumber) => {
		// console.log('Requesting...');
		firebase.auth().settings.appVerificationDisabledForTesting = false;
		let appVerifier = new firebase.auth.RecaptchaVerifier(
			'recaptchaWidget'
		);
		firebase
			.auth()
			.signInWithPhoneNumber(phoneNumber, appVerifier)
			.then((varificationResult) => {
				setRecapVisible(false);
				setVerificationResult(varificationResult);
				// console.log('R1', varificationResult);
			})
			.catch((error) => {
				setOtpError(error.message || 'Error sending sms');
				// console.log('Error sending sms: ', error);
				setDisabled(false);
				setTimeout(() => {
					setRecapVisible(true);
					setMobileVisible(false);
					setOtpVisible(false);
					setOtpError();
				}, 10000);
			});
	};

	const handleVerifyMobileNumber = async (enteredCode) => {
		if (verificationResult) {
			// console.log('Verifying...');
			verificationResult
				.confirm(enteredCode)
				.then((result) => {
					// console.log('R2', result); // DEBUG
					setVerificationResult(result);
					handleMobileVerified();
				})
				.catch((error) => {
					if (error.code === 'auth/invalid-verification-code') {
						notifyError(
							'The SMS verification code used to signup is invalid. Please try again.'
						);
						setOtpError(
							'The SMS verification code used to signup is invalid. Please try again.'
						);
					}
					setTimeout(() => {
						// setDisabled(false);
						// setMobileVisible(true);
						// setOtpVisible(false);
						// setOtpError();
						handleCloseOtp();
					}, 8000);
				});
		} else {
			notifyError('Something went wrong. Please try again.');
		}
	};

	const handleMobileVerified = async () => {
		let contact_number = `${userData.countryCode}${
			userData.localPhoneNumber &&
			userData.localPhoneNumber.length > 0 &&
			userData.localPhoneNumber.substring(0, 1) === '0'
				? userData.localPhoneNumber.substr(1)
				: userData.localPhoneNumber
		}`;

		let [code, res] = await VerifyMobile(contact_number);

		if (code >= 300) {
			notifyError(
				res && res.message !== undefined && res.message.length > 0
					? res.message
					: 'Verification failed. Please try again.'
			);
		} else {
			notifySuccess(
				res && res.message !== undefined && res.message.length > 0
					? res.message
					: 'Phone number verified successfully.'
			);

			setTimeout(function () {
				// setMobileVisible(false);
				// setOtpVisible(false);
				// setOtpError();
				handleCloseOtp();
				handleRedirect(`/`);
				// return code;
			}, 3500);
		}
	};

	const handleCloseOtp = () => {
		setMobileVisible(false);
		setOtpVisible(false);
		setRecapVisible(true);
		setDisabled(false);
		setVerificationResult();
		setOtpError();
	};

	return {
		mobileVisible,
		setMobileVisible,
		userData,
		setUserData,
		handleChange,
		updatePhoneNumber,
		otpVisible,
		setOtpVisible,
		handleRequestMobileVerification,
		recapVisible,
		setRecapVisible,
		handleVerifyMobileNumber,
		otpError,
		setOtpError,
		disabled,
		setDisabled,
		isBusy,
		handleSetUserData,
		handleCloseOtp,
		defaultDataUpdated,
		setDefaultDataUpdated,
	};
};

const OtpContainer = createContainer(useOtp);

export default OtpContainer;
