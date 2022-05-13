import { Request } from '../requestHandler.api';
import { bhooztHeaders } from '../../database/bhoozt_defaults.data';

/**
 * API call to add referral code
 */
const AddReferralCode = async referralCode => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.put(
			'/bhoozt/referral',
			{
				referral_code: referralCode,
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

export { AddReferralCode };
