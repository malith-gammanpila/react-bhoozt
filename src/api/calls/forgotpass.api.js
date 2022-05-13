import { Request } from '../requestHandler.api';
import {
	setUserDefault,
	setBhooztHeaders,
} from '../../database/bhoozt_defaults.data';

/**
 * API call for User password reset request
 */
const PasswordResetRequest = async email => {
	try {
		let res = await Request.get(
			'/user/password/reset?email=' + email + '&type=web'
		);
		return [200, res.data.message];
	} catch (e) {
		return [400, e.response.data.message];
	}
};

/**
 * API call to reset password
 */
// const PasswordReset = async (password, password_confirmation, token) => {
const PasswordReset = async data => {
	try {
		let res = await Request.put('/user/password/update', {
			password: data.password,
			password_confirmation: data.confirmPassword,
			token: data.token,
		});

		await setUserDefault(res.data.content);
		await setBhooztHeaders(res.headers);

		return [200, res.data.message];
	} catch (e) {
		return [400, e.response.data.message];
	}
};

export { PasswordResetRequest, PasswordReset };
