import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';

import messages from './messages.container';

const useNetwork = () => {
	const { notifyError } = messages();

	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		if (isOnline) {
			console.log('NETWORK [ONLINE]');
		} else {
			notifyError('Please check your internet connection');
			console.log('NETWORK [OFFLINE]');
		}
	}, [isOnline, notifyError]);

	return {
		isOnline,
		setIsOnline,
	};
};

const NetworkContainer = createContainer(useNetwork);

export default NetworkContainer;
