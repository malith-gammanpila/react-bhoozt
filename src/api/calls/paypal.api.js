import { Request } from '../requestHandler.api';
import { bhooztHeaders } from '../../database/bhoozt_defaults.data';

/**
 * API call for requesting paypal money
 */
const PayPalPayment = async coins => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.post(
			'/payment/paypal',
			{
				coins: coins,
			},
			{
				headers: headers,
			}
		);

		return [res.status, res.data];
	} catch (e) {
		return [e.response.status, e.response.data];
	}
};

export { PayPalPayment };
