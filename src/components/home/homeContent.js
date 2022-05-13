import React from 'react';
import styled from 'styled-components';
import { Dot } from 'pure-react-carousel';

import HomeContainer from '../../containers/home.container';
import { CenteredContainer } from '../styles/styles';
import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import { NewImageButton, NewImageButtonBig } from '../common/button';
import PlayButton from '../../assets/images/play_btn.svg';
import ForwardButton from '../../assets/images/forward_btn.svg';
import RecordButton from '../../assets/images/record_btn.svg';
import KeyButton from '../../assets/images/key.svg';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import GameContainer from '../../containers/game.container';
import NetworkContainer from '../../containers/network.container';
import messages from '../../containers/messages.container';
import AnalyticContainer from '../../containers/analytic.container';
import { FullscreenModal } from '../common/modal';
import useModal from '../../containers/modal.container';
import CodeReader from '../game/codeReaderModal';

const Heading = styled.p`
	margin: 0 auto;
	padding: 10px 10px 40px 10px;
	width: 100%;
	color: ${colors.darkGreen};
	@media ${smallScreen} {
		font-size: 14px;
	}
	@media ${mediumScreen} {
		font-size: 18px;
	}
	white-space: pre-wrap !important;
`;

const BhooztButtonContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	width: -webkit-fill-available;
`;

const SideContainer = styled.div`
	border: none !important;
	background-color: transparent !important;
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	background-image: url(${(props) => props.image}) !important;
	width: 100%;
	height: 100%;
	max-width: 40px;
`;

const StyledRowWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: 100%;
`;

const StyledRow1 = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 85%;
`;

const StyledButtonWrapper = styled.div`
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	background-image: url(${(props) => props.image}) !important;
	width: 30%;
	height: 75px;
`;

const StyledRow2 = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	margin-top: 60px;
`;

const HomeContent = () => {
	const { setShowGamePhase } = HomeContainer.useContainer();
	const { getNewPiece, isBusy } = GameContainer.useContainer();
	const { height } = useWindowDimensions();
	const { isOnline } = NetworkContainer.useContainer();
	const { notifyError } = messages();
	const { mpBhooztMeButtonTap } = AnalyticContainer.useContainer();

	const {
		handleOpenCreateFunModal,
		handleCloseModal,
		isModalVisible,
		modalType,
	} = useModal();

	const onTap = () => {
		if (isOnline) {
			getNewPiece().then(() => setShowGamePhase(true));
		} else {
			notifyError('Please check your internet connection');
			mpBhooztMeButtonTap('Failure');
		}
	};

	const onRecord = () => {
		if (isOnline) {
			handleOpenCreateFunModal();
		} else {
			notifyError('Please check your internet connection');
			mpBhooztMeButtonTap('Failure');
		}
	};

	return (
		<CenteredContainer height={height}>
			<Heading>FUN</Heading>
			<BhooztButtonContainer>
				<StyledRowWrapper>
					<StyledRow1>
						<StyledButtonWrapper>
							<SideContainer
								as={Dot}
								slide={1}
								image={PlayButton}
							></SideContainer>
							<Heading>PLAY</Heading>
						</StyledButtonWrapper>
						<StyledButtonWrapper>
							<NewImageButtonBig
								onRedirect={!isBusy ? () => onTap() : null}
								image={ForwardButton}
							/>
							<Heading>MORE</Heading>
						</StyledButtonWrapper>
						<StyledButtonWrapper>
							<NewImageButton
								onRedirect={!isBusy ? () => onRecord() : null}
								image={RecordButton}
							/>
							<Heading>MAKE</Heading>
						</StyledButtonWrapper>
					</StyledRow1>
					<StyledRow2>
						<StyledButtonWrapper>
							<CodeReader />
							{/* <NewImageButton
								onRedirect={!isBusy ? () => onTap() : null}
								image={KeyButton}
							/> */}
							<Heading>CODE</Heading>
						</StyledButtonWrapper>
					</StyledRow2>
				</StyledRowWrapper>
			</BhooztButtonContainer>
			<FullscreenModal
				handleCloseModal={handleCloseModal}
				isModalVisible={isModalVisible}
				modalType={modalType}
			/>
		</CenteredContainer>
	);
};

export default HomeContent;
