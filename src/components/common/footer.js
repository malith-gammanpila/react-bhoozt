import React from 'react';
import styled from 'styled-components';

import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import HomeContainer from '../../containers/home.container';
import GameContainer from '../../containers/game.container';
import useModal from '../../containers/modal.container';
import { Dot } from 'pure-react-carousel';
import useRoute from '../../hooks/route.hook';

import PaperPlane from '../../assets/images/paper-plane.svg';
import Share from '../../assets/images/share.svg';
import ShareGame from '../../assets/images/share-game.png';
import { FullscreenModal } from './modal';

const StyledContainer = styled.div`
	flex-direction: row !important;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const StyledColumnLeft = styled.div`
	width: 25px;
	height: 25px;
	flex-direction: column;
	align-items: center;
	justify-content: left;
`;

const StyledColumnCenter = styled.div`
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 55%;
`;

const StyledColumnRight = styled.div`
	flex-direction: column;
	align-items: center;
	justify-content: right;
	height: 25px;
`;

const StyledColumnImage = styled.div`
	width: 25px;
	height: 25px;
	margin: 0 0 0 auto;
	background-image: url(${Share}) !important;
	background-repeat: no-repeat !important;
	background-size: auto !important;
	background-position: center;
	cursor: pointer;
`;

const StyledInviteImage = styled.div`
	width: 35px;
	height: 25px;
	// margin: 0 0 0 auto;
	background-image: url(${ShareGame}) !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	background-position: center;
	cursor: pointer;
`;

const CoinsCount = styled.p`
	color: ${colors.darkGreen};
	font-weight: 700;
	margin: 0 auto !important;
	background-color: transparent;
	border: none;
	@media ${smallScreen} {
		font-size: 24px;
	}
	@media ${mediumScreen} {
		font-size: 28px;
	}
`;

const CoinsLabel = styled.p`
	color: ${colors.darkGreen};
	text-transform: uppercase;
	margin-bottom: 0px;
	@media ${smallScreen} {
		font-size: 12px;
	}
	@media ${mediumScreen} {
		font-size: 14px;
	}
`;

const Footer = () => {
	const {
		user,
		path,
		setShowGamePhase,
		handleLater,
		infoVisible,
		gameIsPublic,
	} = HomeContainer.useContainer();
	const { game } = GameContainer.useContainer();
	const {
		handleOpenShareReferralModal,
		handleOpenShareGameModal,
		handleCloseModal,
		isModalVisible,
		modalType,
	} = useModal();
	const { handleRedirect } = useRoute();
	return (
		<StyledContainer>
			<StyledColumnLeft>
				{/* {path === '/game' ? (
					<StyledInviteImage
						onClick={() => handleOpenShareGameModal()}
					/>
				) : null} */}
			</StyledColumnLeft>
			<StyledColumnCenter>
				<CoinsCount
					as={Dot}
					slide={2}
					onClick={() => {
						handleRedirect('/play');
						setShowGamePhase(false);
						handleLater();
					}}
					infoVisible={infoVisible}
				>
					{user !== null ? user.available_coins : 0}
				</CoinsCount>
				<CoinsLabel>- coins -</CoinsLabel>
			</StyledColumnCenter>
			<StyledColumnRight>
				{path === '/game' ? (
					gameIsPublic ? (
						<StyledColumnImage
							onClick={() => handleOpenShareReferralModal()}
						/>
					) : (
						<StyledColumnImage
							onClick={() => handleOpenShareGameModal()}
						/>
					)
				) : (
					<StyledColumnImage
						onClick={() => handleOpenShareReferralModal()}
					/>
				)}
			</StyledColumnRight>
			<FullscreenModal
				handleCloseModal={handleCloseModal}
				isModalVisible={isModalVisible}
				modalType={modalType}
			/>
		</StyledContainer>
	);
};

export default Footer;
