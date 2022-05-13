import React, { useState } from 'react';
import styled from 'styled-components';
import { Header, Modal, Button, Input, Icon } from 'semantic-ui-react';

import { StyledModal } from '../styles/styles';
import close from '../../assets/images/close.svg';
import qr from '../../assets/images/qr.svg';
import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import Key from '../../assets/images/key.svg';
import HomeContainer from '../../containers/home.container';
import GameContainer from '../../containers/game.container';
import useRoute from '../../hooks/route.hook';
import NetworkContainer from '../../containers/network.container';
import messages from '../../containers/messages.container';
import QrContainer from '../../containers/qr.container';
import QrScanner from '../common/qrScanner';

const StyledHeader = styled(Header)`
	text-align: center;
	margin-top: 10px !important;
	text-transform: uppercase !important;
	color: ${colors.darkGreen} !important;
	font-weight: 700px;
	@media ${smallScreen} {
		font-size: 18px !important;
	}
	@media ${mediumScreen} {
		font-size: 20px !important;
	}
`;

const StyledLabel = styled.p`
	text-align: center;
	color: ${colors.darkGreen};
	@media ${smallScreen} {
		font-size: 14px !important;
	}
	@media ${mediumScreen} {
		font-size: 18px !important;
	}
`;

const StyledSendButton = styled(Button)`
  color: ${colors.white}!important;
  border: 1px solid ${colors.green} !important;
  padding: 15px !important;
  margin: 5px auto !important;
  text-transform: uppercase !important;
  font-weight: 400 !important;
  background-color: ${colors.green}!important;
  @media ${smallScreen} {
    width:100%
    font-size: 14px !important;
  }
  @media ${mediumScreen} {
    width:100%
    font-size: 16px !important;
  }
`;

const StyledInput = styled(Input)`
	height: 43px;
	margin: 10px auto !important;
	width: 100% !important;
	font-size: 16px !important;
	color: ${colors.gray} !important;
	&&.ui.input > input {
		color: ${colors.darkGray} !important;
		border: 0.5px solid ${colors.gray} !important;
	}
	border: 0.5px solid transparent;
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

const StyledButton = styled.button`
	background-position: left !important;
	background-repeat: no-repeat !important;
	background-size: auto !important;
	background-color: transparent !important;
	margin-top: 5px !important;
	background-image: url(${Key}) !important;
	border: none;
	cursor: pointer;
	@media ${smallScreen} {
		width: 30px;
		height: 30px;
		&&.ui.button {
			padding: 15px !important;
		}
	}
	@media ${mediumScreen} {
		width: 35px;
		height: 35px;
		&&.ui.button {
			padding: 20px !important;
		}
	}
`;

const StyledImageButton = styled(Button)`
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	background-image: url(${qr}) !important;
	background-color: transparent !important;
	box-shadow: 1px 3px 10px ${colors.gray} !important;
	@media ${smallScreen} {
		width: 70px;
		height: 70px;
		border-radius: 0 !important;
	}
	@media ${mediumScreen} {
		border-radius: 0 !important;
		width: 100px;
		height: 100px;
	}
`;

const StyledWinButton = styled(StyledImageButton)`
	height: 70px !important;
	width: 70px !important;
	box-shadow: none !important;
	background-size: contain !important;
	filter: saturate(0) !important;
`;

const StyledQrWrapper = styled.div`
	width: 100%;
	// border: 1px solid red;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 35px 20px 20px 20px;
`;

const StyledButtonLable = styled.p`
	font-size: 16px !important;
	color: ${colors.green} !important;
	margin-top: 15px;
	font-weight: 700;
`;

const PopupModal = () => {
	const {
		gameCode,
		setGameCode,
		handleGameCode,
		handleChangeGameCode,
		handleGameClick,
	} = HomeContainer.useContainer();
	const { setGameId } = GameContainer.useContainer();
	const { handleRedirect } = useRoute();
	const { isOnline } = NetworkContainer.useContainer();
	const { notifyError } = messages();
	const { handleOpenQrModal } = QrContainer.useContainer();

	const [show, setShow] = useState(false);

	const handleOpen = () => {
		setShow(true);
	};
	const handleClose = () => {
		setShow(false);
		setGameCode('');
	};

	const hadleOnClick = async () => {
		if (isOnline) {
			handleGameCode('game_code').then((id) => {
				if (id) {
					handleRedirect('/play');
					handleGameClick(id);
					setGameId(id);
					handleRedirect('/game');
				}
			});
		} else {
			notifyError('Please check your internet connection');
		}
		handleClose();
	};

	const handleOnClickQr = () => {
		setShow(false);
		handleOpenQrModal();
	};

	return (
		<StyledModal
			trigger={<StyledButton onClick={handleOpen} />}
			open={show}
			onClose={handleClose}
		>
			<Modal.Content>
				<StyledCloseButton onClick={handleClose}>
					<BackgroundImage />
				</StyledCloseButton>
				<StyledHeader>SCAN QR</StyledHeader>
				<QrScanner />
				<StyledLabel>OR</StyledLabel>
				{/* <StyledLabel>Enter Bhoozt Code</StyledLabel> */}
				<StyledInput
					placeholder="Enter Bhoozt Code"
					icon
					iconPosition="left"
				>
					<input
						onChange={handleChangeGameCode}
						type="text"
						value={gameCode}
						name="code"
					/>
					<Icon name="key" />
				</StyledInput>
				<StyledSendButton
					onClick={
						gameCode !== ''
							? () => hadleOnClick()
							: () =>
									notifyError(
										'Sorry, code is invalid or expired. Please check'
									)
					}
				>
					{' '}
					Unlock{' '}
				</StyledSendButton>
			</Modal.Content>
		</StyledModal>
	);
};

export default PopupModal;
