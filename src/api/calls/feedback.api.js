import { Request } from '../requestHandler.api';
import { bhooztHeaders } from '../../database/bhoozt_defaults.data';

const AppFeedback = async feedback => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.post(
			'app/feedback',
			{
				message: feedback,
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

export { AppFeedback };
