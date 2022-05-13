import { useState } from 'react';
import { createContainer } from 'unstated-next';

import useRoute from '../hooks/route.hook';
import messages from './messages.container';

const useMaintenance = () => {
	const { handleRedirect } = useRoute();
	const { notifyForceDismiss } = messages();

	const [isMaintenanceModalVisible, setIsMaintenanceModalVisible] = useState(
		false
	);
	const [msg, setMsg] = useState('');

	const handleCloseMaintenanceModal = () => {
		setMsg('');
		setIsMaintenanceModalVisible(false);
		if (window.location.pathname) {
			if (window.location.pathname !== '/') {
				handleRedirect('/play');
			}
		}
	};

	const handleOpenMaintenanceModal = message => {
		notifyForceDismiss();
		setMsg(
			message || 'Down for maintenance. Please come back in few munutes..'
		);
		setIsMaintenanceModalVisible(true);
	};

	return {
		isMaintenanceModalVisible,
		handleCloseMaintenanceModal,
		handleOpenMaintenanceModal,
		msg,
	};
};

const MaintenanceContainer = createContainer(useMaintenance);

export default MaintenanceContainer;
