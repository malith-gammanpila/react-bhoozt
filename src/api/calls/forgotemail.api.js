import { Request } from '../requestHandler.api';

/**
 * API call for User password reset request
 */
const EmailRequest = async (phone) => {
	try {
		let res = await Request.post('user/email/forgot', {
			phone: phone,
		});
		return [200, res.data.message];
	} catch (e) {
		return [400, e.response.data.message];
	}
};

export { EmailRequest };
