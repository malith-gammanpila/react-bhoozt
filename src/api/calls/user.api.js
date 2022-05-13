import { Request } from '../requestHandler.api';
import {
	bhooztHeaders,
	setAnoUserDefault,
	setUserDefault,
	userDefaults,
	setBhooztHeaders,
	setUserConfirm,
} from '../../database/bhoozt_defaults.data';
import { UniqueID } from '../../utils';

/**
 * API call for User Authentication
 */
const SignIn = async (userName, password) => {
	try {
		const res = await Request.post('/user/sign_in', {
			email: userName,
			password: password,
		});
		// if (res.data.data.is_otp_confirmed) {
		// }
		await setUserDefault(res.data.data);
		await setBhooztHeaders(res.headers);

		return [res.status, res.data.data];
	} catch (e) {
		return [400, e.response];
	}
};

/**
 * API call for User registration, ano user can send device id and ano email
 */
const SignUp = async (data, uid, anoEmail) => {
	try {
		let id = uid ? uid : UniqueID();

		let form_data = new FormData();
		if (data.image) {
			form_data.append(
				'image',
				data.image ? data.image : null,
				data.image ? data.image.name : null
			);
		}
		form_data.append('email', data.email);
		form_data.append('password', data.password);
		form_data.append('password_confirmation', data.confirmPassword);
		form_data.append('first_name', data.firstName);
		form_data.append('last_name', data.lastName);
		if (data.localPhoneNumber && data.countryCode) {
			let pNumber = `${data.countryCode}${
				data.localPhoneNumber &&
				data.localPhoneNumber.length > 0 &&
				data.localPhoneNumber.substring(0, 1) === '0'
					? data.localPhoneNumber.substr(1)
					: data.localPhoneNumber
			}`;
			form_data.append('contact_number', pNumber);
		}
		form_data.append('device_unique_id', id);
		form_data.append(
			'sex',
			data.gender === undefined ? 'male' : data.gender
		);
		form_data.append('date_of_birth', data.birthDate);
		form_data.append('latitude', data.latitude ? data.latitude : null);
		form_data.append('longitude', data.longitude ? data.longitude : null);
		if (
			data.payPalEmail &&
			data.payPalEmail !== null &&
			data.payPalEmail !== 'null'
		) {
			form_data.append('pay_pal_email', data.payPalEmail);
		}
		form_data.append('anonymous_user_email', anoEmail);

		const res = await Request.post('/user/signup', form_data, {
			headers: {
				'content-type': 'multipart/form-data',
			},
		});

		await setAnoUserDefault(res.data.content.user);
		await setBhooztHeaders(res.headers);

		return [res.status, res.data];
	} catch (e) {
		return [e.response.status, e.response.data];
	}
};

/**
 * API call for User Authentication
 */
const ProfileDetails = async () => {
	try {
		let user = await userDefaults();
		let headers = await bhooztHeaders();
		const res = await Request.get('/user/details?id=' + user.id, {
			headers: headers,
		});
		await setUserDefault(res.data.content.user);
		return [res.status, res.data.content.user];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

/**
 * API call for User profile update
 * Send data object as same as the sign up
 */
const ProfileUpdate = async (data) => {
	// console.log('UPDATE_DATA:', data); // DEBUG
	try {
		let form_data = new FormData();

		if (data.image) {
			form_data.append(
				'image',
				data.image ? data.image : null,
				data.image ? data.image.name : null
			);
		}
		form_data.append('id', data.id);
		form_data.append('email', data.email);
		if (data.oldPassword && data.oldPassword.length > 6) {
			form_data.append('old_password', data.oldPassword);
		}
		form_data.append('password', data.password);
		form_data.append('password_confirmation', data.confirmPassword);
		form_data.append('first_name', data.firstName);
		form_data.append('last_name', data.lastName);

		if (data.localPhoneNumber && data.countryCode) {
			let pNumber = `${data.countryCode}${
				data.localPhoneNumber &&
				data.localPhoneNumber.length > 0 &&
				data.localPhoneNumber.substring(0, 1) === '0'
					? data.localPhoneNumber.substr(1)
					: data.localPhoneNumber
			}`;
			form_data.append('contact_number', pNumber);
		}

		form_data.append(
			'sex',
			data.gender === undefined ? 'male' : data.gender
		);
		form_data.append('date_of_birth', data.birthDate);
		form_data.append('latitude', data.latitude ? data.latitude : null);
		form_data.append('longitude', data.longitude ? data.longitude : null);

		if (
			data.payPalEmail &&
			data.payPalEmail !== '' &&
			data.payPalEmail !== null
		) {
			form_data.append('pay_pal_email', data.payPalEmail);
		} else {
			form_data.append('pay_pal_email', '');
		}

		let headers = await bhooztHeaders();
		headers['Content-Type'] = 'multipart/form-data';

		const res = await Request.put('/user/update', form_data, {
			headers: headers,
		});
		// console.log('RESPONSE_DATA:', res); // DEBUG

		await setBhooztHeaders(res.headers);
		await setUserDefault(res.data.content.user);

		return [res.status, res.data];
	} catch (e) {
		// console.log(e.response);
		return [e.response.status, e.response.data];
	}
};

/**
 * API call for User phone number update
 * Send data object
 */
const PhoneNumberUpdate = async (data) => {
	// console.log('UPDATE_DATA:', data); // DEBUG
	try {
		let headers = await bhooztHeaders();
		headers['Content-Type'] = 'multipart/form-data';

		let form_data = new FormData();

		form_data.append('id', data.id);
		form_data.append('email', data.email);
		form_data.append('contact_number', data.contact_number);

		const res = await Request.put('user/mobile/update', form_data, {
			headers: headers,
		});
		// console.log('RESPONSE_DATA:', res); // DEBUG

		await setUserDefault(res.data.content.user);

		return [res.status, res.data];
	} catch (e) {
		// console.log(e.response);
		return [e.response.status, e.response.data];
	}
};

/**
 * API call for mobile verification
 */
const VerifyMobile = async (data) => {
	// console.log('UPDATE_DATA:', data); // DEBUG
	try {
		let headers = await bhooztHeaders();
		headers['Content-Type'] = 'multipart/form-data';

		let user = await userDefaults();

		let form_data = new FormData();

		form_data.append('user', user.id);
		form_data.append('contact_number', data);

		const res = await Request.put('/user/mobile/confirm', form_data, {
			headers: headers,
		});
		// console.log('RESPONSE_DATA:', res); // DEBUG

		await setUserDefault(res.data.content.user);

		return [res.status, res.data];
	} catch (e) {
		// console.log(e.response);
		return [e.response.status, e.response.data];
	}
};

/**
 * API call for User Authentication
 */
const CreateAnonymousUser = async (inviteToken) => {
	try {
		let id = UniqueID();
		let res = null;
		if (inviteToken !== null && inviteToken !== '') {
			res = await Request.post('/user/anonymous', {
				device_unique_id: id,
				invite_token: inviteToken,
			});
		} else {
			res = await Request.post('/user/anonymous', {
				device_unique_id: id,
			});
		}
		await setAnoUserDefault(res.data.content.user, id);
		await setBhooztHeaders(res.headers);
		return [res.status, res.data.content.user];
	} catch (e) {
		return [e.response.status, e.response.data];
	}
};

/**
 * API call for User profile update
 * Send data object as same as the sign up
 */
const SignOut = async () => {
	try {
		await Request.delete('/user/sign_out');
		return 200;
	} catch (e) {
		return 400;
	}
};

/**
 * API call for social login
 * need type facebook or google
 * id of the login facbookId or googleId
 * need same data format as signup with new ID
 */
const SocialLogin = async (data, type) => {
	try {
		let res;
		if (type === 'facebook') {
			res = await Request.post('/user/facebook', data);
		} else {
			res = await Request.post('/user/google', data);
		}

		await setUserDefault(res.data.content.user);
		await setBhooztHeaders(res.headers);

		return [200, res.data];
	} catch (e) {
		return [400, e.response];
	}
};

/**
 * API call to get the confirmation status of email, paypal and phone number
 * @param {number} user user id
 */
const ConfirmationStatus = async (user) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.get('user/confirmed', {
			headers: headers,
			params: { user: user },
		});

		await setUserConfirm(res.data.content.user);

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

/**
 * API call: Request to unlock email
 * @param {number} user user id
 */
const UnlockEmail = async (user) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.post(
			'user/email/unlock',
			{ user: user },
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

/**
 * API call: Request to unlock paypal
 * @param {number} user user id
 */
const UnlockPaypal = async (user) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.post(
			'user/paypal/unlock',
			{ user: user },
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

/**
 * API call: Request to unlock phone
 * @param {number} user user id
 */
const UnlockPhone = async (user) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.post(
			'user/mobile/unlock',
			{ user: user },
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

/**
 * API call: Request to deactivate account
 * @param {number} user user id
 */
const Deactivate = async (user) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.post(
			'user/deactivate',
			{ user: user },
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

/**
 * API call: Request to resend verification emails
 */
const ReVerify = async () => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.post(
			'user/reverify',
			{},
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

export {
	SignIn,
	CreateAnonymousUser,
	ProfileDetails,
	SignOut,
	ProfileUpdate,
	PhoneNumberUpdate,
	VerifyMobile,
	SignUp,
	SocialLogin,
	ConfirmationStatus,
	UnlockEmail,
	UnlockPaypal,
	UnlockPhone,
	Deactivate,
	ReVerify,
};
