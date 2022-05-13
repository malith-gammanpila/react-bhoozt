import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';

import useRoute from '../hooks/route.hook';
import messages from './messages.container';

const useSuspend = () => {
	const { notifyError, notifyForceDismiss } = messages();
	const { handleRedirect } = useRoute();

	const [isFlagged, setIsFlagged] = useState(false);

	const handleOpenFlaggedModal = () => {
		notifyForceDismiss();
		setIsFlagged(true);
	};

	const handleCloseFlaggedModal = () => {
		setIsFlagged(false);
		if (window.location.pathname) {
			if (window.location.pathname !== '/') {
				handleRedirect('/play');
			}
		}
	};

	return {
		isFlagged,
		setIsFlagged,
		handleOpenFlaggedModal,
		handleCloseFlaggedModal,
	};
};

const SuspendContainer = createContainer(useSuspend);

export default SuspendContainer;
