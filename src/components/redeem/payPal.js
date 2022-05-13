import React, { useEffect } from 'react';
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
import CoinBagIcon from '../../assets/images/coin-bag.png';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import ProfileContainer from '../../containers/profile.container';
import NetworkContainer from '../../containers/network.container';
import useModal from '../../containers/modal.container';
import messages from '../../containers/messages.container';
import { FullscreenModal } from '../common/modal';
import AnalyticContainer from '../../containers/analytic.container';

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

const StyledImage = styled.div`
	align-self: center !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	// position: relative !important;
	background-position: center !important;
	background-image: url(${CoinBagIcon}) !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	@media ${smallScreen} {
		// top: 35px;
		height: 75px;
		width: 75px;
	}
	@media ${mediumScreen} {
		// right: 0px;
		// top: 60px;
		height: 100px;
		width: 100px;
	}
`;

const StyledCoinLabel = styled(Truncate)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-top: 6px !important;
	height: 40px;
	color: ${colors.green};
	padding-left: 10px;
	@media ${smallScreen} {
		font-size: 18px;
	}
	@media ${mediumScreen} {
		font-size: 22px;
	}
`;

const StyledInputField = styled(Input)`
	&&.ui.input > input {
		color: ${colors.green} !important;
		border: 0.5px solid ${colors.gray} !important;
	}
	min-height: 43px;
	margin: 5px auto;
	color: ${colors.gray} !important;
	@media ${smallScreen} {
		font-size: 16px !important;
		width: 100px;
	}
	@media ${mediumScreen} {
		width: 100px;
		font-size: 16px !important;
	}
	text-align: center !important;
	&& input[type='number'] {
		text-align: center !important;
	}
	border: 0.5px solid transparent;
	&& input[type='number'] {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
	}
	&& input[type='number']::-webkit-inner-spin-button,
	&& input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;

const Message = styled.p`
	color: ${colors.red};
`;

const StyledRow = styled(Row)`
	&& {
		display: flex !important;
	}
	@media ${smallScreen} {
		width: 100%;
	}
	@media ${mediumScreen} {
		width: 500px;
	}
`;

const ButtonColumn = styled(Column)`
	&& {
		display: flex !important;
	}
	flex-direction: row;
	margin-top: 20px;
`;

const StyledColumn = styled(Column)`
	text-align: ${(props) => props.direction};
`;

const CoinContent = (props) => {
	const { handleRedirect } = useRoute();
	const { height } = useWindowDimensions();
	const {
		user,
		coinVal,
		coins,
		handleChange,
		handleFocus,
		handleLater,
		setPath,
		handleRedeem,
	} = HomeContainer.useContainer();
	const { mpRedeemViaPayPal } = AnalyticContainer.useContainer();

	const { profile } = ProfileContainer.useContainer();
	const {
		handleOpenRegisterModal,
		handleOpenProfileModal,
		handleCloseModal,
		isModalVisible,
		modalType,
	} = useModal();
	const { isOnline } = NetworkContainer.useContainer();
	const { notifyError, notifyLongError } = messages();

	useEffect(() => {
		setPath(props.location.pathname);
	}, [props.location.pathname]);

	const handleOnClick = (user) => {
		if (user.user_role === 'anonymous') {
			handleOpenRegisterModal();
			mpRedeemViaPayPal(
				user.available_coins,
				parseInt(coins),
				'Not Eligible'
			);
		} else if (user.pay_pal_email === null || user.pay_pal_email === '') {
			handleOpenProfileModal();
			notifyLongError(
				'Oops, we don’t seem to have your PayPal account. Please add it below and then check your email to confirm we have it right.'
			);
			mpRedeemViaPayPal(
				user.available_coins,
				parseInt(coins),
				'No PayPal Email'
			);
		} else if (user.available_coins < 200) {
			notifyError(
				'You need at least 200 coin to do this. Keep going, you’re close.'
			);
			mpRedeemViaPayPal(
				user.available_coins,
				parseInt(coins),
				'Insufficient Coins'
			);
		} else if (coins < 200) {
			notifyError(
				'You need at least 200 coin to do this. Keep going, you’re close.'
			);
			mpRedeemViaPayPal(
				user.available_coins,
				parseInt(coins),
				'Insufficient Coins'
			);
		} else {
			if (user.available_coins >= parseInt(coins)) {
				handleClickNow();
			}
			mpRedeemViaPayPal(user.available_coins, parseInt(coins), 'Success');
		}
	};

	const handleClickNow = () => {
		if (isOnline) {
			handleRedeem();
		} else {
			notifyError('Please check your internet connection');
		}
	};

	const coinsValue = coins * coinVal;

	return (
		<>
			<CenteredContainer height={height}>
				<Heading>
					Please enter number of coins you want to cash in via PayPal
				</Heading>
				<StyledRow>
					<StyledColumn width={8} direction={'right'}>
						<StyledInputField
							type={'number'}
							value={coins !== null ? coins : 0}
							onClick={handleFocus}
							onChange={handleChange}
						/>
					</StyledColumn>
					<StyledColumn width={8} direction={'left'}>
						<StyledCoinLabel lines={1} ellipsis={<span>...</span>}>
							coins = US$
							{coinsValue ? coinsValue.toFixed(2) : '0.00'}
						</StyledCoinLabel>
					</StyledColumn>
				</StyledRow>
				<Heading>Please note, fees apply</Heading>
				<Row>
					{user.available_coins < parseInt(coins) ? (
						<Message>{"You don't have this much coins"}</Message>
					) : (
						''
					)}
				</Row>
				<Row>
					<ButtonColumn>
						<SmallButton
							as={Dot}
							backgroundcolor={colors.red}
							slide={0}
							onClick={() => {
								handleLater();
								handleRedirect('/play');
							}}
						>
							Later
						</SmallButton>
						<StyledImage />
						<SmallButton
							backgroundcolor={colors.green}
							onClick={() => handleOnClick(profile)}
						>
							Now
						</SmallButton>
					</ButtonColumn>
				</Row>
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
