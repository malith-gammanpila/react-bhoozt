import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Dot } from 'pure-react-carousel';
import { Confirm } from 'semantic-ui-react';

// import { MaxUsers } from '../../api/calls/forward.api';

import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import { Row, Column, CenteredContainer } from '../styles/styles';
import { InputField } from '../common/input';
import HomeContainer from '../../containers/home.container';
import useRoute from '../../hooks/route.hook';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import { StyledRoundButton } from '../common/button';
import KkBird from '../../assets/images/kk-bird.png';
import PayPal from '../../assets/images/paypal.png';
import messages from '../../containers/messages.container';
import NetworkContainer from '../../containers/network.container';
import ForwardContainer from '../../containers/forward.container';
import useModal from '../../containers/modal.container';
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
	white-space: pre-wrap !important;
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
	padding: 0 !important;
`;

const StyledImage = styled(SmallButton)`
	margin-top: -60px !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	position: relative !important;
	background-image: url(${KkBird}) !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	@media ${smallScreen} {
		top: 60px;
	}
	@media ${mediumScreen} {
		right: 0px;
		top: 60px;
	}
	// height: 80px !important;
	// width: 80px !important;
	cursor: default !important;
	padding-buttom: 0;
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

const PayForward = styled.div`
	font-size: 18px;
	color: ${colors.darkGray};
	font-weight: 800;
	cursor: pointer !important;
	@media ${smallScreen} {
		margin: 30px !important;
	}
	@media ${mediumScreen} {
		margin: 30px !important;
	}
`;

const StyledConfirm = styled(Confirm)`
	&&.ui.modal > .actions {
		background-color: ${colors.white} !important;
		border-top: none !important;
	}
	&&&.ui.modal .actions > .button {
		color: #000000 !important;
		background: transparent !important;
	}
	@media ${smallScreen} {
		width: 300px !important;
	}
	@media ${mediumScreen} {
		width: 400px !important;
	}
	&&&.ui.small.modal {
		position: unset !important;
		margin: auto;
	}
`;

const Message = styled.p`
	color: ${colors.red};
`;

const StyledBtnText = styled.p`
	margin: 0px;
	height: 30px;
	vertical-align: middle;
	line-height: 23px;
	margin-bottom: -9px !important;
`;
const StyledBtnTextGreen = styled.p`
	margin: 0px;
	height: 15px;
`;

const StyledRow = styled(Row)`
	padding-top: 30px !important;
`;

const Forward = (props) => {
	const {
		user,
		setPath,
		handleRedeem,
		handleLater,
		coins,
		checkMaxUsers,
		maxUsers,
		setMaxUsers,
		forwardCoins,
		setForwardCoins,
		changeMaxUsers,
		changeForwardCoins,
		handleFocus,
		sendCoins,
	} = HomeContainer.useContainer();
	const {
		handleOpenRegisterModal,
		handleOpenProfileModal,
		handleCloseModal,
		isModalVisible,
		modalType,
	} = useModal();
	const { mpShareViaPayForward } = AnalyticContainer.useContainer();
	const { handleRedirect, handleGoBack } = useRoute();
	const { height } = useWindowDimensions();
	const { isOnline } = NetworkContainer.useContainer();
	const { notifyError, notifyProgress } = messages();
	// const { maxUsers, setMaxUsers } = ForwardContainer.useContainer();

	const [players, setPlayers] = useState(0);
	const [fCoins, setFCoins] = useState(0);

	const [open, setOpen] = useState(false);

	const show = async () => {
		setOpen(true);
	};

	useEffect(() => {
		if (maxUsers !== -1) {
			if (maxUsers === 0) {
				notifyError(
					'Sorry, no eligible users found. Please try again later'
				);
			} else if (maxUsers > 0) {
				show();
			}
		}
	}, [maxUsers, open]);

	const handleClickForward = async () => {
		if (!isOnline) {
			notifyError('Please check your internet connection');
		} else if (forwardCoins < 10) {
			notifyError('Minimum amount is 10 coins');

			// Mixpanel analytics
			if (user && user.available_coins && forwardCoins) {
				mpShareViaPayForward(
					user.available_coins,
					parseInt(forwardCoins),
					'Wrong Amount'
				);
			}
		} else {
			await checkMaxUsers(forwardCoins);
		}
	};

	const handleOnClick = (user) => {
		if (user.user_role === 'anonymous') {
			handleOpenRegisterModal();

			// Mixpanel analytics
			if (user && user.available_coins && forwardCoins) {
				mpShareViaPayForward(
					user.available_coins,
					parseInt(forwardCoins),
					'Not Eligible'
				);
			}
		} else if (user.pay_pal_email === null || user.pay_pal_email === '') {
			handleOpenProfileModal();
			notifyError(
				'Please enter an email signed up with PayPal to pay forward'
			);
			// Mixpanel analytics
			if (user && user.available_coins && forwardCoins) {
				mpShareViaPayForward(
					user.available_coins,
					parseInt(forwardCoins),
					'No PayPal Email'
				);
			}
		} else if (user.available_coins >= parseInt(forwardCoins)) {
			handleClickForward();
		} else if (user.available_coins < parseInt(forwardCoins)) {
			// Mixpanel analytics
			if (user && user.available_coins && forwardCoins) {
				mpShareViaPayForward(
					user.available_coins,
					parseInt(forwardCoins),
					'Insufficient Coins'
				);
			}
		}
	};

	const handleConfirm = (close) => {
		setMaxUsers(-1);
		setOpen(false);
	};

	const handleCancel = () => {
		setMaxUsers(-1);
		setOpen(false);
	};

	useEffect(() => {
		setForwardCoins(user.available_coins);
	}, []);

	useEffect(() => {
		setPath(props.location.pathname);
	}, [props.location.pathname]);

	const handleForward = () => {
		if (isOnline) {
			sendCoins(maxUsers, forwardCoins);
		} else {
			notifyError('Please check your internet connection');
		}
	};

	return (
		<>
			<CenteredContainer height={height}>
				<Heading>
					Nice! Let's earn some good Karma by randomly distributing
					coin. How much coin should we distribute?
				</Heading>
				<Row style={{ alignItems: 'center' }}>
					<Column
						style={{
							width: 100,
							textAlign: 'left',
							color: colors.green,
							fontSize: 20,
						}}
					>
						Coins
					</Column>
					<Column style={{ width: 100 }}>
						<InputField
							// type="number"
							name="coins"
							onChange={(e) => changeForwardCoins(e)}
							onClick={(e) => handleFocus(e)}
							value={forwardCoins}
						/>
					</Column>
				</Row>
				<Row>
					{user.available_coins < parseInt(forwardCoins) ? (
						<Message>{"You don't have this much coins"}</Message>
					) : (
						''
					)}
				</Row>
				{/* <Row style={{ alignItems: 'center' }}>
				<Column
					style={{
						width: 100,
						textAlign: 'left',
						color: colors.green,
						fontSize: 20,
					}}
				>
					Players
				</Column>
				<Column style={{ width: 100 }}>
					<InputField
						// type="number"
						name="players"
						onChange={(e) => changeMaxUsers(e)}
						onClick={(e) => handleFocus(e)}
						value={maxUsers}
					/>
				</Column>
			</Row> */}
				<StyledRow>
					{/* <Column> */}
					<SmallButton
						backgroundcolor={colors.red}
						as={Dot}
						slide={0}
						onClick={() => {
							setForwardCoins(0);
							handleRedirect('/play');
							handleLater();
						}}
					>
						<StyledBtnText>Later</StyledBtnText>
					</SmallButton>
					<StyledImage />
					<SmallButton
						backgroundcolor={colors.green}
						onClick={() => handleOnClick(user)}
					>
						<StyledBtnTextGreen>Pay</StyledBtnTextGreen>
						<StyledBtnTextGreen>Forward</StyledBtnTextGreen>
					</SmallButton>
					<StyledConfirm
						open={open}
						onCancel={handleCancel}
						content={`Yay! We're about to randomly distribute ${forwardCoins} coins to make ${maxUsers} people happy. Ready?`}
						cancelButton="Later"
						confirmButton="Yeah"
						onConfirm={() => handleConfirm(handleForward())}
					/>
					{/* </Column> */}
				</StyledRow>
			</CenteredContainer>
			<FullscreenModal
				handleCloseModal={handleCloseModal}
				isModalVisible={isModalVisible}
				modalType={modalType}
			/>
		</>
	);
};

export default Forward;
