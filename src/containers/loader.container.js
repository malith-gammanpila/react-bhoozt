import {} from 'react';
import { bhooztHeaders, userDefaults } from '../database/bhoozt_defaults.data';

const useLoader = () => {
	const isUserAvailable = async () => {
		let bhooztUser = await userDefaults();
		let headers = await bhooztHeaders();

		return (
			bhooztUser != null &&
			bhooztUser.id > -1 &&
			bhooztUser.email.length > 0 &&
			headers != null
		);
	};

	return { isUserAvailable };
};

export default useLoader;
