import { Request } from '../requestHandler.api';
import { bhooztHeaders } from '../../database/bhoozt_defaults.data';

const FindGeoGames = async (lat, lng) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.post(
			'/geogames/find',
			{
				lat: lat,
				lng: lng,
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

export { FindGeoGames };
