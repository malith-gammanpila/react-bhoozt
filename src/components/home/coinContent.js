import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { Dot } from 'pure-react-carousel';
import Truncate from 'react-truncate';

import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import { Row, Column, CenteredContainer } from '../styles/styles';
import HomeContainer from '../../containers/home.container';
import useRoute from '../../hooks/route.hook';
import { StyledRoundButton } from '../common/button';
import PiggyIcon from '../../assets/images/piggy-bank.svg';
import CoinBagIcon from '../../assets/images/coin-bag.png';
import PayPal from '../../assets/images/paypal.png';
import Forward from '../../assets/images/forward-button.png';
import Kokopo from '../../assets/images/kk-bird.png';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import ProfileContainer from '../../containers/profile.container';
import useModal from '../../containers/modal.container';
import messages from '../../containers/messages.container';
import AnalyticContainer from '../../containers/analytic.container';
import { FullscreenModal } from '../common/modal';

const Heading = styled.p`
	margin: 0 auto;
	padding: 20px 10px 10px 20px;
	color: ${colors.darkGreen};
	@media ${smallScreen} {
		font-size: 14px;
	}
	@media ${mediumScreen} {
		font-size: 18px;
	}
`;

const PayPalWrapper = styled.div`
	background-color: ${colors.green};
	border-radius: 8px;
	cursor: pointer;
`;

const ForwardWrapper = styled.div`
	background-color: ${colors.red};

	border-radius: 8px;
	cursor: pointer;
`;

const PayPalImage = styled.div`
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
	right: 0 !important;
	top: 0 !important;
	margin: 15px 30px;
	background-image: url(${PayPal}) !important;
	@media ${smallScreen} {
		width: 150px !important;
		height: 36px !important;
	}
	@media ${mediumScreen} {
		width: 210px !important;
		height: 50px !important;
	}
	min-height: 30px;
`;

const PayForwardButton = styled.div`
	// background-repeat: no-repeat;
	// background-size: contain;
	// background-position: center;
	right: 0 !important;
	top: 0 !important;
	margin: 15px 30px;
	line-height: initial;
	color: white;
	// background-image: url(${PayPal}) !important;
	@media ${smallScreen} {
		width: 150px !important;
		height: 36px !important;
		padding: 10px 0px;
		font-size: 18px;
	}
	@media ${mediumScreen} {
		width: 210px !important;
		height: 50px !important;
		padding: 12px 0px;
		font-size: 22px;
	}
	min-height: 30px;
`;

const ForwardImage = styled.div`
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
	right: 0 !important;
	top: 0 !important;
	background-image: url(${Forward}) !important;
	@media ${smallScreen} {
		margin-top: 15px;
		width: 150px !important;
		height: 36px !important;
	}
	@media ${mediumScreen} {
		margin-top: 15px;
		width: 210px !important;
		height: 50px !important;
	}
	min-height: 30px;
	cursor: pointer;
`;

const CoinBagImage = styled.div`
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
	background-image: url(${CoinBagIcon}) !important;
	position: absolute;
	filter: drop-shadow(-1px 0px 1px rgba(0, 0, 0, 0.5));
	@media ${smallScreen} {
		width: 50px !important;
		height: 70px !important;
		margin-top: -10px;
		margin-left: 155px;
	}
	@media ${mediumScreen} {
		// width: 50px !important;
		// height: 80px !important;
		width: 55px !important;
		height: 85px !important;
		margin-top: -8px;
		margin-left: 215px; //240px;
	}
`;

const KokopoImage = styled.div`
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
	background-image: url(${Kokopo}) !important;
	position: absolute;
	filter: drop-shadow(1px 0px 1px rgba(0, 0, 0, 0.5));
	@media ${smallScreen} {
		width: 70px !important;
		height: 70px !important;
		margin-top: -30px;
		margin-left: -65px;
	}
	@media ${mediumScreen} {
		width: 80px !important;
		height: 80px !important;
		margin-top: -32px;
		margin-left: -70px;
	}
`;

const CoinContent = () => {
	const { handleRedirect } = useRoute();
	const { height } = useWindowDimensions();
	const { handleCloseModal, isModalVisible, modalType } = useModal();
	const { mpTapPayPal, mpTapPayForward } = AnalyticContainer.useContainer();

	const handleRedirectPayPal = () => {
		// Mixpanel analytics
		mpTapPayPal();

		handleRedirect('/paypal');
	};

	const handleRedirectForward = () => {
		// Mixpanel analytics
		mpTapPayForward();

		handleRedirect('/forward');
	};

	return (
		<>
			<CenteredContainer height={height}>
				<Heading>Do you want to Cash In via</Heading>
				<PayPalWrapper onClick={() => handleRedirectPayPal()}>
					<PayPalImage>
						<CoinBagImage />
					</PayPalImage>
				</PayPalWrapper>
				<Heading>Or have some fun by randomly:</Heading>
				<ForwardWrapper onClick={() => handleRedirectForward()}>
					<PayForwardButton>
						Paying It Forward
						<KokopoImage />
					</PayForwardButton>
				</ForwardWrapper>
				<ForwardImage onClick={() => handleRedirectForward()} />
			</CenteredContainer>
			{/* Modal for notification */}
			<FullscreenModal
				handleCloseModal={handleCloseModal}
				isModalVisible={isModalVisible}
				modalType={modalType}
			/>
		</>
	);
};

export default CoinContent;
