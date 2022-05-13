import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Dot } from 'pure-react-carousel';

import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import { Row, Column, CenteredContainer } from '../styles/styles';
import HomeContainer from '../../containers/home.container';
import useRoute from '../../hooks/route.hook';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import { StyledRoundButton } from '../common/button';
import PiggyIcon from '../../assets/images/piggy-bank.svg';
import PayPal from '../../assets/images/paypal.png';
import messages from '../../containers/messages.container';
import NetworkContainer from '../../containers/network.container';

const Heading = styled.p`
	margin: 0 auto;
	padding: 20px 10px;
	color: ${colors.darkGreen};
	@media ${smallScreen} {
		font-size: 14px;
	}
	@media ${mediumScreen} {
		font-size: 18px;
	}
`;

const SmallButton = styled(StyledRoundButton)`
	color: ${colors.white} !important;
	background-color: ${(props) => props.backgroundcolor} !important;
	border: 0 solid transparent !important;
	box-shadow: 1px 3px 4px ${colors.gray} !important;
	@media ${smallScreen} {
		margin-left: 10px !important;
		margin-right: 10px !important;
		width: 70px;
		height: 70px;
	}
	@media ${mediumScreen} {
		margin-left: 15px !important;
		margin-right: 15px !important;
		width: 100px;
		height: 100px;
	}
`;

const StyledImage = styled(SmallButton)`
	background-repeat: no-repeat !important;
	background-size: auto !important;
	position: relative !important;
	background-image: url(${PiggyIcon}) !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	@media ${smallScreen} {
		top: 35px;
	}
	@media ${mediumScreen} {
		right: 0px;
		top: 60px;
	}
`;

const PayPalImage = styled.div`
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
	right: 0 !important;
	top: 0 !important;
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

const RedeemContent = (props) => {
	const { setPath, handleRedeem, handleLater } = HomeContainer.useContainer();
	const { handleRedirect } = useRoute();
	const { height } = useWindowDimensions();
	const { isOnline } = NetworkContainer.useContainer();
	const { notifyError } = messages();

	useEffect(() => {
		setPath(props.location.pathname);
	}, [props.location.pathname]);

	const handleClick = () => {
		if (isOnline) {
			handleRedeem();
		} else {
			notifyError('Please check your internet connection');
		}
	};

	return (
		<CenteredContainer height={height}>
			<Heading>Transfer to PayPal</Heading>
			<PayPalImage />
			<Heading>Please note, fees apply</Heading>
			<Row>
				<Column>
					<SmallButton
						backgroundcolor={colors.red}
						as={Dot}
						slide={0}
						onClick={() => {
							handleRedirect('/play');
							handleLater();
						}}
					>
						Later
					</SmallButton>
					<StyledImage />
					<SmallButton
						backgroundcolor={colors.green}
						onClick={() => handleClick()}
					>
						Now
					</SmallButton>
				</Column>
			</Row>
		</CenteredContainer>
	);
};

export default RedeemContent;
