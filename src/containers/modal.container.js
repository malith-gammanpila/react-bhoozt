import { useState, useEffect } from 'react';

const useModal = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalType, setModalType] = useState('');
	const [link, setLink] = useState();
	const [closeAll, setCloseAll] = useState(false);

	useEffect(() => {
		if (closeAll === true) {
			handleCloseModal();
			setCloseAll(false);
		}
	}, [closeAll]);

	const handleCloseModal = () =>
		isModalVisible ? setIsModalVisible(false) : null;

	const handleOpenRegisterModal = () => {
		setModalType('register');
		setIsModalVisible(true);
	};

	const handleOpenProfileModal = () => {
		setModalType('profile');
		setIsModalVisible(true);
	};

	const handleOpenNotificationModal = () => {
		setModalType('notification');
		setIsModalVisible(true);
	};

	const handleOpenShareReferralModal = () => {
		setModalType('referral');
		setIsModalVisible(true);
	};

	const handleOpenShareGameModal = () => {
		setModalType('sharegame');
		setIsModalVisible(true);
	};

	const handleOpenShareFreeGameModal = () => {
		setModalType('sharefreegame');
		setIsModalVisible(true);
	};

	const handleOpenShareGrowthGameModal = () => {
		setModalType('sharegrowthgame');
		setIsModalVisible(true);
		// setLink(data.link);
	};

	const handleOpenFunModal = () => {
		setModalType('fun');
		setIsModalVisible(true);
	};

	const handleOpenFriendsModal = () => {
		setModalType('friends');
		setIsModalVisible(true);
	};

	const handleOpenCreateFunModal = () => {
		setModalType('createFun');
		setIsModalVisible(true);
	};

	return {
		isModalVisible,
		handleCloseModal,
		modalType,
		handleOpenRegisterModal,
		handleOpenProfileModal,
		handleOpenNotificationModal,
		handleOpenShareReferralModal,
		handleOpenShareGameModal,
		handleOpenShareFreeGameModal,
		handleOpenShareGrowthGameModal,
		handleOpenFunModal,
		handleOpenFriendsModal,
		handleOpenCreateFunModal,
		setCloseAll,
		link,
		setLink,
	};
};

export default useModal;
