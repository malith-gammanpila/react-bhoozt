import { Request } from '../requestHandler.api';
import { bhooztHeaders } from '../../database/bhoozt_defaults.data';

const CreateGame = async (data, crop) => {
	try {
		let form_data = new FormData();
		if (data) {
			form_data.append('image', data);
			form_data.append('width', crop.width);
			form_data.append('height', crop.height);
			form_data.append('x', crop.x);
			form_data.append('y', crop.y);
		}
		let headers = await bhooztHeaders();
		const res = await Request.post('/game/free/create', form_data, {
			headers: headers,
		});

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

const ShareGame = async (data) => {
	try {
		let headers = await bhooztHeaders();
		const res = await Request.post('/game/free/share', data, {
			headers: headers,
		});

		return [res.status, res.data];
	} catch (e) {
		return e && e.response
			? [e.response.status, e.response.data]
			: [400, 'Error'];
	}
};

export { CreateGame, ShareGame };
