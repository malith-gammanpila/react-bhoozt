import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Header, Modal, Button, Input, Grid } from 'semantic-ui-react';
import QrReader from 'react-qr-reader';

import {
	AddInvitedPvtGame,
	AddInvitedPvtGrowthGame,
} from '../../api/calls/game.api';
import { PasswordResetRequest } from '../../api/calls/forgotpass.api';
import { EmailRequest } from '../../api/calls/forgotemail.api';
import { StyledModal, Row, Column } from '../styles/styles';

import messages from '../../containers/messages.container';
import profileContainer from '../../containers/profile.container';
import RegisterContainer from '../../containers/register.container';
import PushContainer from '../../containers/push.container';
import HomeContainer from '../../containers/home.container';
import NotifiContainer from '../../containers/notification.container';
import useFeedbackModal from '../../containers/feedback.container';
import MaintenanceContainer from '../../containers/maintenance.container';
import SuspendContainer from '../../containers/suspend.container';
import GameContainer from '../../containers/game.container';
import OtpContainer from '../../containers/otp.container';
import useRoute from '../../hooks/route.hook';
import { TextAreaField } from '../../components/common/textarea';

// Modal screens
import Register from '../signIn/register';
import Profile from '../signIn/profile';
import Notification from '../notification/notification';
import MobileVerification from '../signIn/mobileVerification';
import FunNearby from '../funNearby';
import Friends from '../friends';
import CreateFun from '../createFun';
import ShareFreeGame from './shareFreeGame';
import ShareReferral from './shareReferral';
import ShareGame from './shareGame';

import close from '../../assets/images/close.svg';
import maintenance from '../../assets/images/maintenance.svg';
import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import QrContainer from '../../containers/qr.container';
import { userDefaults } from '../../database/bhoozt_defaults.data';
import ShareGrowthGame from './shareGrowthGame';

const StyledGrid = styled(Grid)`
	margin-top: 0px !important;
`;

const StyledLink = styled.a`
	display: flex;
	justify-content: flex-start;
	text-decoration: underline;
	text-transform: capitalize;
	color: ${colors.green} !important;
	padding: 10px 10px 0px 10px;
	@media ${smallScreen} {
		font-size: 12px !important;
	}
	@media ${mediumScreen} {
		font-size: 16px !important;
	}
`;
const StyledHeader = styled(Header)`
	text-align: center;
	margin: 0 !important;
	text-transform: uppercase !important;
	color: ${colors.darkGreen} !important;
	@media ${smallScreen} {
		font-size: 12px !important;
	}
	@media ${mediumScreen} {
		font-size: 16px !important;
	}
`;

const StyledSendButton = styled(Button)`
	color: ${colors.white}!important;
	border: 1px solid ${colors.green} !important;
	padding: 15px !important;
	width: 100%;
	margin: 5px auto !important;
	background-color: ${colors.green}!important;
	text-transform: uppercase !important;
	@media ${smallScreen} {
		font-size: 12px !important;
	}
	@media ${mediumScreen} {
		font-size: 16px !important;
	}
`;
const StyledInput = styled(Input)`
	margin: 10px auto !important;
	height: 43px;
	width: 100%;
	color: ${colors.gray} !important;
	font-size: 16px !important;
	&&.ui.input > input {
		color: ${colors.darkGray} !important;
		border: 0.5px solid ${colors.gray} !important;
	}
`;

const StyledColoredInput = styled(StyledInput)`
	&&.ui.input > input {
		color: #000000d4 !important;
		border: 0.5px solid ${colors.gray} !important;
	}
`;

const StyledLabel = styled.p`
	text-align: center;
	height: 60px;
	line-height: 60px;
	color: ${colors.darkGreen};
`;

const StyledCloseButton = styled(Button)`
	float: right;
	background-color: transparent !important;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	margin-right: 0px !important;
	margin-top: 0px !important;
	padding: 0em !important;
`;

const BackgroundImage = styled.div`
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	background-image: url(${close}) !important;
	@media ${smallScreen} {
		width: 20px;
		height: 20px;
	}
	@media ${mediumScreen} {
		width: 20px;
		height: 20px;
	}
`;

const StyledFullscreenModal = styled(Modal)`
	&&& {
		background-color: ${colors.white} !important;
		border-radius: 0px !important;
		height: 100% !important;
		width: 100% !important;
		// TODO
		// max-width: 768px;
		margin: 0px !important;
		// bottom: 0px !important;
		// right: 0px !important;
		left: 0px !important;
		top: 0px !important;
		overflow-y: auto;
	}
`;

// Reactangular Modal

const StyledMainHeader = styled(StyledHeader)`
	text-transform: uppercase !important;
	font-weight: 400 !important;
	padding: 20px 10px !important;
	@media ${smallScreen} {
		font-size: 18px !important;
	}
	@media ${mediumScreen} {
		font-size: 20px !important;
	}
`;

const StyledSubHeader = styled(StyledMainHeader)`
	text-transform: capitalize !important;
	@media ${smallScreen} {
		font-size: 16px !important;
	}
	@media ${mediumScreen} {
		font-size: 18px !important;
	}
`;

const StyledContent = styled(StyledSubHeader)`
	text-transform: none !important;
	@media ${smallScreen} {
		font-size: 14px !important;
	}
	@media ${mediumScreen} {
		font-size: 16px !important;
	}
`;

const StyledOkButton = styled(StyledSendButton)`
	text-transform: initial !important;
	padding: 0 !important;
	@media ${smallScreen} {
		width: 85px;
		height: 40px;
	}
	@media ${mediumScreen} {
		width: 90px;
		height: 50px;
	}
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	padding: 10px 0;
`;

const StyledFeedbackHeader = styled(StyledMainHeader)`
	font-weight: 700 !important;
	padding-top: 0px !important;
	@media ${smallScreen} {
		padding-bottom: 15px !important;
	}
`;

const StyledMaintenanceHeader = styled(StyledMainHeader)`
	font-weight: 700 !important;
	padding-top: 15px !important;
	@media ${smallScreen} {
		padding-bottom: 0px !important;
	}
`;

const StyledMobileVeriHeader = styled(StyledMainHeader)`
	font-weight: 700 !important;
	padding-top: 15px !important;
	@media ${smallScreen} {
		padding-bottom: -10px !important;
	}
`;

const StyledMobileContent = styled(StyledContent)`
	@media ${smallScreen} {
		padding: 5px 10px !important;
	}
	@media ${mediumScreen} {
		padding: 5px 10px !important;
	}
`;

const StyledMobileContentLink = styled(StyledContent)`
	cursor: pointer;
	text-align: right;
	@media ${smallScreen} {
		padding: 5px 0 !important;
	}
	@media ${mediumScreen} {
		padding: 5px 0 !important;
	}
`;

const StyledHelpLink = styled.a`
	color: ${colors.darkGreen} !important;
`;

const StyledMobileContent1 = styled(StyledMobileContent)`
	@media ${smallScreen} {
		padding: 5px 10px 0 10px !important;
	}
	@media ${mediumScreen} {
		padding: 5px 10px 0 10px !important;
	}
`;

const StyledMobileContent2 = styled(StyledMobileContent)`
	@media ${smallScreen} {
		padding: 0 10px 5px 10px !important;
	}
	@media ${mediumScreen} {
		padding: 0 10px 5px 10px !important;
	}
`;

const StyledQrHeader = styled(StyledMainHeader)`
	font-weight: 700 !important;
	padding-top: 15px !important;
	@media ${smallScreen} {
		// padding-bottom: 0px !important;
	}
`;

const StyledImage = styled.div`
	width: 100px;
	height: 100px;
	background-position: center;
	background-repeat: no-repeat;
	background-size: contain;
	background-image: url(${maintenance}) !important;
	margin: 10px auto;
`;

const PopupModal = ({ label, type }) => {
	const [show, setShow] = useState(false);
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [countryCode, setCountryCode] = useState(
		process.env.REACT_APP_CUSTOM_NODE_ENV === 'production' ||
			process.env.REACT_APP_CUSTOM_NODE_ENV === 'staging'
			? '+61'
			: '+94'
	);

	const { notifyError, notifySuccess, notifyProgress } = messages();

	const handleOpen = () => {
		setShow(true);
	};

	const handleClose = () => {
		setShow(false);
	};

	const sendRequestPasswordForgot = async (e) => {
		setShow(false);
		notifyProgress('Please wait...');
		let [code, res] = await PasswordResetRequest(email);

		if (code === 200) {
			notifySuccess(res);
		} else if (
			code === 400 &&
			res !==
				`We're in the process of upgrading Bhoozt in order to give you a better Bhoozt. Please check back later. We should be done pretty soon. Thanks for being part of the Bhoozt family.`
		) {
			notifyError(res);
		}
		setPhone('');
	};

	const sendRequestEmailForgot = async (e) => {
		if (phone && phone.length >= 9) {
			setShow(false);
			notifyProgress('Please wait...');

			let phoneNumber = `${countryCode}${
				phone.substr(0, 1) === '0' ? phone.substr(1) : phone
			}`;

			let [code, res] = await EmailRequest(phoneNumber);

			if (code === 200) {
				notifySuccess(res);
			} else if (
				code === 400 &&
				res !==
					`We're in the process of upgrading Bhoozt in order to give you a better Bhoozt. Please check back later. We should be done pretty soon. Thanks for being part of the Bhoozt family.`
			) {
				notifyError(res);
			}
		} else {
			notifyError('Invalid phone number');
		}
		setPhone('');
	};

	const handleChangeEmail = (e) => {
		setEmail(e.target.value);
	};

	const handleChangePhone = (e) => {
		setPhone(e.target.value);
	};

	return (
		<StyledModal
			trigger={
				<StyledLink onClick={handleOpen}>{`${label}?`}</StyledLink>
			}
			open={show}
			onClose={handleClose}
		>
			<Modal.Content>
				<Row>
					<Column>
						<StyledCloseButton onClick={handleClose}>
							<BackgroundImage />
						</StyledCloseButton>
					</Column>
				</Row>
				<Row>
					<Column>
						<StyledHeader>{label}</StyledHeader>
					</Column>
				</Row>
				{type === 'password' ? (
					<StyledGrid>
						<Grid.Column width={4}>
							<StyledLabel>{'Email'}</StyledLabel>
						</Grid.Column>
						<Grid.Column width={12}>
							<StyledInput
								name="email"
								value={email}
								onChange={handleChangeEmail}
							/>
						</Grid.Column>
					</StyledGrid>
				) : (
					<StyledGrid>
						<Grid.Column width={3}>
							<StyledLabel>{'Mobile'}</StyledLabel>
						</Grid.Column>
						<Grid.Column width={5}>
							<StyledInput
								name="countryCode"
								value={countryCode}
								disabled
							/>
						</Grid.Column>
						<Grid.Column width={8}>
							<StyledInput
								name="phone"
								value={phone}
								onChange={handleChangePhone}
								maxLength="10"
							/>
						</Grid.Column>
					</StyledGrid>
				)}
				<StyledSendButton
					onClick={
						type === 'password'
							? sendRequestPasswordForgot
							: sendRequestEmailForgot
					}
				>
					{' '}
					Send{' '}
				</StyledSendButton>
			</Modal.Content>
		</StyledModal>
	);
};

const RenderModalContent = (props) => {
	switch (props.modalType) {
		case 'register':
			return (
				<RegisterContainer.Provider>
					<profileContainer.Provider>
						<Register handleCloseModal={props.handleCloseModal} />
					</profileContainer.Provider>
				</RegisterContainer.Provider>
			);
		case 'profile':
			return <Profile handleCloseModal={props.handleCloseModal} />;
		case 'notification':
			return <Notification handleCloseModal={props.handleCloseModal} />;
		case 'referral':
			return <ShareReferral handleCloseModal={props.handleCloseModal} />;
		case 'sharegame':
			return <ShareGame handleCloseModal={props.handleCloseModal} />;
		case 'sharefreegame':
			return <ShareFreeGame handleCloseModal={props.handleCloseModal} />;
		case 'sharegrowthgame':
			return (
				<ShareGrowthGame
					handleCloseModal={props.handleCloseModal}
					data={props.data}
				/>
			);
		case 'fun':
			return <FunNearby handleCloseModal={props.handleCloseModal} />;
		case 'friends':
			return <Friends handleCloseModal={props.handleCloseModal} />;
		case 'createFun':
			return <CreateFun handleCloseModal={props.handleCloseModal} />;
		default:
			return <Header>Wrong route!</Header>;
	}
};

const FullscreenModal = (props) => {
	return (
		<StyledFullscreenModal
			size={'fullscreen'}
			open={props.isModalVisible}
			onClose={() => props.handleCloseModal()}
		>
			<RenderModalContent {...props} />
		</StyledFullscreenModal>
	);
};

const SquareModal = () => {
	const {
		user,
		setUser,
		setCoins,
		setTempGameId,
		handleGeoGameCode,
		setCloseAllPopups,
		handleGameClick,
	} = HomeContainer.useContainer();
	const { setGameId } = GameContainer.useContainer();
	const { notifyError, notifySuccess } = messages();
	const { handleRedirect } = useRoute();
	const {
		pushData,
		setPushData,
		handleClearPushData,
		getUserDetails,
		handleAddReferralCode,
		handleClickSayThanks,
		// handleAddInvitedPvtGame,
	} = PushContainer.useContainer();
	const {
		handleClick,
		fetchNotificationHistory,
	} = NotifiContainer.useContainer();

	const [show, setShow] = useState(false);

	useEffect(() => {
		if (pushData === null) {
			setShow(false);
		} else if (pushData !== null && !pushData.r && !pushData.pgi_token) {
			fetchNotificationHistory().then(() => setShow(true));
		} else if (pushData !== null && pushData.r && !pushData.pgi_token) {
			if (user && user.is_referral_added === false) {
				handleAddReferralCode(pushData.r);
			} else if (user && user.is_referral_added === true) {
				notifyError('You have already added a referral code.');
			}
		} else if (
			pushData !== null &&
			pushData.pgi_token &&
			!pushData.r &&
			!pushData.ref
		) {
			handleGoToInvitedGame(pushData.pgi_token);
			handleClearPushData();
		} else if (
			pushData !== null &&
			pushData.pgi_token &&
			!pushData.r &&
			pushData.ref
		) {
			console.log('Done ================');
			handleGoToInvitedGrowthGame(pushData.pgi_token, pushData.ref);
			handleClearPushData();
		}
	}, [pushData, user]);

	const handleClose = () => {
		handleUpdateCoins();
		setShow(false);
		handleClearPushData();
	};

	/**
	 * Handle notification read
	 */
	const handleClickOk = () => {
		if (
			pushData &&
			pushData.notificationId &&
			pushData.notificationId !== null
		) {
			handleClick(parseInt(pushData.n));
		}
		handleClose();
	};

	/**
	 * Handle notification read
	 */
	const handleClickGotIt = () => {
		handleClose();
	};

	/**
	 * Method to update user coins
	 */
	const handleUpdateCoins = async () => {
		if (pushData) {
			const [code, res] = await getUserDetails();
			if (code >= 300) {
				notifyError('Something went wrong');
			} else {
				setTimeout(async () => {
					let user = await userDefaults();
					setUser(user);
				}, 2000);
			}
		}
	};

	const sayThanks = () => {
		handleClickSayThanks(pushData.transactionKey);
		handleClickOk();
	};

	const handleGoToGame = () => {
		setCloseAllPopups(true);
		handleClose();
		handleGeoGameCode(pushData.gameCode).then((id) => {
			handleGameClick(id);
			setTempGameId(id);
			setGameId(id);
			setTimeout(() => {
				handleRedirect('/game');
			}, 500);
		});
	};

	// API call
	const handleAddInvitedPvtGame = async (pgiToken) => {
		const [status, data] = await AddInvitedPvtGame(pgiToken);

		if (status >= 300) {
			notifyError(
				data && data.message !== undefined && data.message.length > 0
					? data.message
					: 'Something went wrong'
			);
			return null;
		} else {
			notifySuccess(
				data && data.message !== undefined && data.message.length > 0
					? `${data.message}: ${data.content.game.title}`
					: 'Game added successfully'
			);
			return data.content.game.id;
		}
	};

	// API call
	const handleAddInvitedPvtGrowthGame = async (pgiToken, ref) => {
		const [status, data] = await AddInvitedPvtGrowthGame(pgiToken, ref);

		if (status >= 300) {
			notifyError(
				data && data.message !== undefined && data.message.length > 0
					? data.message
					: 'Something went wrong'
			);
			return null;
		} else {
			notifySuccess(
				data && data.message !== undefined && data.message.length > 0
					? `${data.message}: ${data.content.game.title}`
					: 'Game added successfully'
			);
			return data.content.game.id;
		}
	};

	// handle redirection
	const handleGoToInvitedGame = (pgiToken) => {
		setCloseAllPopups(true);
		handleClose();
		handleAddInvitedPvtGame(pgiToken).then((id) => {
			handleGameClick(id);
			setTempGameId(id);
			setGameId(id);
			setTimeout(() => {
				handleRedirect('/game');
			}, 500);
		});
	};

	// handle redirection
	const handleGoToInvitedGrowthGame = (pgiToken, ref) => {
		setCloseAllPopups(true);
		handleClose();
		handleAddInvitedPvtGrowthGame(pgiToken, ref).then((id) => {
			console.log('refff', ref);
			handleGameClick(id);
			setTempGameId(id);
			setGameId(id);
			setTimeout(() => {
				handleRedirect('/game');
			}, 500);
		});
	};

	const PopupBody = () => {
		switch (pushData.type) {
			case 'test':
				return <StyledContent>{pushData.body}</StyledContent>;
			case 'ins1':
				return (
					<>
						<StyledSubHeader>instant prize</StyledSubHeader>
						<StyledContent>{`Hey, ${pushData.s} just paid  you forward ${pushData.coins} coin`}</StyledContent>
						<ButtonContainer>
							<StyledOkButton onClick={() => handleClickOk()}>
								OK
							</StyledOkButton>
						</ButtonContainer>
					</>
				);
			case 'cir1':
				return (
					<>
						<StyledContent>{pushData.body}</StyledContent>
						<ButtonContainer>
							<StyledOkButton onClick={() => handleClickOk()}>
								OK
							</StyledOkButton>
						</ButtonContainer>
					</>
				);
			case 'coi1':
				return (
					<>
						<StyledContent>{pushData.body}</StyledContent>
						<ButtonContainer>
							<StyledOkButton onClick={() => sayThanks()}>
								Say Thanks
							</StyledOkButton>
						</ButtonContainer>
					</>
				);
			case 'coi2':
				return (
					<>
						<StyledContent>{pushData.body}</StyledContent>
						<ButtonContainer>
							<StyledOkButton onClick={() => handleClickOk()}>
								OK
							</StyledOkButton>
						</ButtonContainer>
					</>
				);
			case 'coi3':
				return (
					<>
						<StyledContent>{pushData.body}</StyledContent>
						<ButtonContainer>
							<StyledOkButton onClick={() => handleClickOk()}>
								OK
							</StyledOkButton>
						</ButtonContainer>
					</>
				);
			case 'geo1':
				return (
					<>
						<StyledContent>{pushData.body}</StyledContent>
						<ButtonContainer>
							<StyledOkButton onClick={() => handleGoToGame()}>
								PLAY
							</StyledOkButton>
						</ButtonContainer>
					</>
				);
			case 'grw1':
				return (
					<>
						<StyledContent>{pushData.body}</StyledContent>
						<ButtonContainer>
							<StyledOkButton onClick={() => handleClickGotIt()}>
								OK
							</StyledOkButton>
						</ButtonContainer>
					</>
				);
			case 'grw2':
				return (
					<>
						<StyledContent>{pushData.body}</StyledContent>
						<ButtonContainer>
							<StyledOkButton onClick={() => handleClickGotIt()}>
								OK
							</StyledOkButton>
						</ButtonContainer>
					</>
				);
			default:
				return (
					<StyledContent>
						Sorry, this content isn’t available right now or the
						link you followed may have expired.
					</StyledContent>
				);
		}
	};

	return (
		<StyledModal
			open={show}
			onClose={handleClose}
			onUnmount={() => handleClose()}
		>
			<Modal.Content>
				<Row>
					<Column>
						<StyledCloseButton onClick={() => handleClose()}>
							<BackgroundImage />
						</StyledCloseButton>
					</Column>
				</Row>
				{pushData ? (
					<>
						{pushData.title ? (
							<StyledMainHeader>
								{pushData.title}
							</StyledMainHeader>
						) : null}
						<PopupBody />
					</>
				) : null}
			</Modal.Content>
		</StyledModal>
	);
};

const FeedbackModal = (props) => {
	const { handleChange, handleSubmitFeedback, messages } = useFeedbackModal();

	return (
		<StyledModal open={props.isShow}>
			<Modal.Content>
				<Row>
					<Column>
						<StyledCloseButton onClick={props.handleSend}>
							<BackgroundImage />
						</StyledCloseButton>
					</Column>
				</Row>
				<Row>
					<Column>
						<StyledFeedbackHeader>feedback</StyledFeedbackHeader>
					</Column>
				</Row>
				<TextAreaField
					name={'messages'}
					value={messages}
					onChange={handleChange}
				/>
				<StyledSendButton
					onClick={() => {
						props.handleSend();
						handleSubmitFeedback();
					}}
				>
					send
				</StyledSendButton>
			</Modal.Content>
		</StyledModal>
	);
};

const MaintenanceModal = () => {
	const {
		isMaintenanceModalVisible,
		handleCloseMaintenanceModal,
		msg,
	} = MaintenanceContainer.useContainer();

	return (
		<StyledModal open={isMaintenanceModalVisible}>
			<Modal.Content>
				<Row>
					<Column>
						<StyledImage />
					</Column>
				</Row>
				<Row>
					<Column>
						<StyledMaintenanceHeader>
							Maintenance In Progress
						</StyledMaintenanceHeader>
					</Column>
				</Row>
				<Row>
					<Column>
						<StyledContent>{`${msg}`}</StyledContent>
					</Column>
				</Row>
				<StyledSendButton onClick={() => handleCloseMaintenanceModal()}>
					GOT IT
				</StyledSendButton>
			</Modal.Content>
		</StyledModal>
	);
};

const FlaggedModal = () => {
	const { isFlagged, setIsFlagged } = SuspendContainer.useContainer();

	return (
		<StyledModal open={isFlagged}>
			<Modal.Content>
				<Row>
					<Column>
						<StyledMaintenanceHeader>
							PLEASE NOTE
						</StyledMaintenanceHeader>
					</Column>
				</Row>
				<Row>
					<Column>
						<StyledContent>
							{'Your account has been temporarily suspended.'}
						</StyledContent>
					</Column>
				</Row>
				<StyledSendButton onClick={() => setIsFlagged(false)}>
					OK
				</StyledSendButton>
			</Modal.Content>
		</StyledModal>
	);
};

const VerifyMobileModal = () => {
	const {
		mobileVisible,
		userData,
		handleChange,
		updatePhoneNumber,
		isBusy,
		handleCloseOtp,
	} = OtpContainer.useContainer();
	return (
		<StyledModal open={mobileVisible}>
			<Modal.Content>
				<Row>
					<Column>
						<StyledCloseButton onClick={() => handleCloseOtp()}>
							<BackgroundImage />
						</StyledCloseButton>
					</Column>
				</Row>
				<Row>
					<Column>
						<StyledMobileVeriHeader>
							Mobile Verification
						</StyledMobileVeriHeader>
					</Column>
				</Row>
				<Row>
					<Column>
						<StyledMobileContent1>
							{`Checking it's you.`}
						</StyledMobileContent1>
						<StyledMobileContent2>
							{`We'll send a code to your mobile number. Please enter it upon receipt.`}
						</StyledMobileContent2>
					</Column>
				</Row>
				<StyledGrid>
					<Grid.Column width={5}>
						<StyledColoredInput
							name="countryCode"
							value={
								process.env.REACT_APP_CUSTOM_NODE_ENV ===
									'production' ||
								process.env.REACT_APP_CUSTOM_NODE_ENV ===
									'staging'
									? '+61'
									: '+94'
							}
							disabled
						/>
					</Grid.Column>
					<Grid.Column width={11}>
						<StyledInput
							name="localPhoneNumber"
							value={
								userData && userData.localPhoneNumber
									? userData.localPhoneNumber
									: ''
							}
							onChange={handleChange}
							maxLength="10"
						/>
					</Grid.Column>
				</StyledGrid>
				<StyledSendButton onClick={updatePhoneNumber} disabled={isBusy}>
					CONTINUE
				</StyledSendButton>
				<StyledMobileContentLink>
					<StyledHelpLink
						href={
							'https://bhoozt.com/sp_faq/oops-mobile-tied-to-another-account/'
						}
						target="_blank"
					>
						<u>Help</u>
					</StyledHelpLink>
				</StyledMobileContentLink>
			</Modal.Content>
		</StyledModal>
	);
};

const OtpModal = () => {
	const { otpVisible, userData } = OtpContainer.useContainer();
	return (
		<StyledFullscreenModal open={otpVisible}>
			<Modal.Content>
				<MobileVerification
					title={'Enter the verification code.'}
					description={
						userData && userData.localPhoneNumber
							? `Let's make sure it's really you. We've just sent a text message with a fresh verification code to your number ending in ******
				${userData.localPhoneNumber.substr(userData.localPhoneNumber.length - 4)}
				`
							: `Let's make sure it's really you. We've just sent a text message with a fresh verification code to your number`
					}
				/>
			</Modal.Content>
		</StyledFullscreenModal>
	);
};

const QrModal = () => {
	const { setGameId } = GameContainer.useContainer();
	const {
		isQrVisible,
		handleCloseQrModal,
		setResult,
		setError,
		validated,
		msg,
		gameId,
	} = QrContainer.useContainer();

	useEffect(() => {
		gameId ? setGameId(gameId) : setGameId();
	}, [gameId]);

	return (
		<StyledModal open={isQrVisible}>
			<Modal.Content>
				<Row>
					<Column>
						<StyledCloseButton onClick={() => handleCloseQrModal()}>
							<BackgroundImage />
						</StyledCloseButton>
					</Column>
				</Row>
				<Row>
					<Column>
						<StyledQrHeader>QR CODE SCANNER</StyledQrHeader>
					</Column>
				</Row>
				<Row>
					<Column>
						{validated ? null : (
							<QrReader
								delay={500}
								onError={(e) => setError(e)}
								onScan={(r) => setResult(r)}
								showViewFinder={false}
								style={{ width: '100%' }}
							/>
						)}
					</Column>
				</Row>
				<Row>
					<Column>
						<StyledContent>{`${
							msg || 'Scanning..'
						}`}</StyledContent>
					</Column>
				</Row>
			</Modal.Content>
		</StyledModal>
	);
};

export {
	PopupModal,
	FullscreenModal,
	SquareModal,
	FeedbackModal,
	MaintenanceModal,
	FlaggedModal,
	QrModal,
	VerifyMobileModal,
	OtpModal,
};
