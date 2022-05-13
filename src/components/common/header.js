import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import { Dot, ButtonBack } from 'pure-react-carousel';
import useWindowDimensions from '../../hooks/windowDimention.hook';

import { FullscreenModal } from '../../components/common/modal';
import { smallScreen, mediumScreen } from '../../utils/media';
import { colors } from '../../utils/colors';
import Notification from '../../assets/images/notification.svg';
import NotificationUnread from '../../assets/images/notification_unread.svg';
import { Row, Column, MainHeader } from '../styles/styles';
import HomeContainer from '../../containers/home.container';
import NotifiContainer from '../../containers/notification.container';
import useModal from '../../containers/modal.container';
import useRoute from '../../hooks/route.hook';
import CodeReader from '../game/codeReaderModal';
import QrContainer from '../../containers/qr.container';

import { QrModal } from '../common/modal';
import qr from '../../assets/images/qr.svg';
// import { AppIcon } from '../common/icons/appIcon';

const NavHeading = styled(MainHeader)`
	margin-top: 0px !important;
	@media ${smallScreen} {
		padding: 0px 0px 0px 0px !important;
	}
	@media ${mediumScreen} {
		padding: 0px 10px 10px 10px;
	}
`;

const StyledButton = styled(Button)`
	background-position: left !important;
	background-repeat: no-repeat !important;
	background-size: auto !important;
	background-color: transparent !important;
	margin-top: 5px !important;
	background-image: url(${(props) => props.image}) !important;
	@media ${smallScreen} {
		width: 24px;
		height: 24px;
	}
	@media ${mediumScreen} {
		width: 30px;
		height: 30px;
		margin-left: ${(props) =>
			props.type === 'Notification' ? `${20}px` : 0} !important;
	}
`;

const StyledBackButton = styled(StyledButton)`
	margin: 0 !important;
	border: none !important;
	@media ${smallScreen} {
		padding: 3px 0 0 0 !important;
	}
	@media ${mediumScreen} {
		padding: 5px 0 0 0 !important;
	}
`;

const StyledIcon = styled.i`
	color: ${colors.buttonGray};
	@media ${smallScreen} {
		font-size: 25px;
	}
	@media ${mediumScreen} {
		font-size: 30px;
	}
`;

const StyledRow = styled(Row)`
	padding: 10px !important;
	width: ${(props) => props.width}px;
	max-width: 800px;
`;

const StyledColumn = styled(Column)`
	text-align: ${(props) => props.direction};
`;

const StyledColumnHeader = styled(Column)`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Header = ({ title, image, action }) => {
	const {
		setSidebarVisibility,
		setShowGamePhase,
		handleWithNewPiece,
		additionalBackVisible,
	} = HomeContainer.useContainer();
	const { newCount } = NotifiContainer.useContainer();
	const { handleRedirect, handleGoBack } = useRoute();
	const {
		handleOpenNotificationModal,
		handleCloseModal,
		isModalVisible,
		modalType,
	} = useModal();
	const { handleOpenQrModal } = QrContainer.useContainer();

	const { width } = useWindowDimensions();

	const handleClick = () => {
		if (action === 'sidebar') {
			setSidebarVisibility(true);
		} else if (action === 'back') {
			setShowGamePhase(false);
			handleWithNewPiece().then(() => handleRedirect('/play'));
		} else if (action === 'game') {
			// handleRedirect('/play');
			handleGoBack();
		} else if (action === 'goBack') {
			handleGoBack();
		}
	};

	return (
		<>
			<StyledRow width={width}>
				{!additionalBackVisible ? (
					<StyledColumn
						button
						mobile={2}
						tablet={1}
						computer={1}
						direction={'left'}
						onClick={handleClick}
					>
						{action === 'back' || action === 'goBack' ? (
							<StyledBackButton>
								<StyledIcon className={'icon-back'} />
							</StyledBackButton>
						) : (
							<StyledButton onClick={handleClick} image={image} />
						)}
					</StyledColumn>
				) : null}

				{additionalBackVisible &&
				action !== 'back' &&
				action !== 'goBack' ? (
					<StyledColumn
						mobile={2}
						tablet={1}
						computer={1}
						direction={'left'}
					>
						<StyledBackButton as={Dot} slide={0}>
							<StyledIcon className={'icon-back'} />
						</StyledBackButton>
					</StyledColumn>
				) : null}

				<StyledColumn
					mobile={2}
					tablet={1}
					computer={1}
					direction={'left'}
				>
					<StyledButton
						onClick={handleOpenNotificationModal}
						image={newCount > 0 ? NotificationUnread : Notification}
						type={'Notification'}
					/>
				</StyledColumn>
				<StyledColumnHeader
					mobile={additionalBackVisible ? 8 : 8}
					tablet={additionalBackVisible ? 12 : 12}
					computer={additionalBackVisible ? 12 : 12}
				>
					<NavHeading>{title}</NavHeading>
				</StyledColumnHeader>
				<StyledColumn
					mobile={additionalBackVisible ? 4 : 4}
					tablet={additionalBackVisible ? 2 : 2}
					computer={additionalBackVisible ? 2 : 2}
					direction={'right'}
				>
					<CodeReader />
				</StyledColumn>
			</StyledRow>

			{/* Modal for notification */}
			<FullscreenModal
				handleCloseModal={handleCloseModal}
				isModalVisible={isModalVisible}
				modalType={modalType}
			/>
			{/* Modal for qr scanner */}
			<QrModal />
		</>
	);
};

Header.propTypes = {
	title: PropTypes.string.isRequired,
	image: PropTypes.string,
	action: PropTypes.string.isRequired,
};

export default Header;
