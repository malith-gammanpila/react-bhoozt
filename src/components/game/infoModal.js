import React, { useState } from 'react';
import styled from 'styled-components';
import { Header, Modal, Button } from 'semantic-ui-react';

import { StyledModal } from '../styles/styles';
import close from '../../assets/images/close.svg';
import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import Info from '../../assets/images/info.svg';
import GameContainer from '../../containers/game.container';

const StyledHeader = styled(Header)`
	text-align: center;
	margin-top: 10px !important;
	text-transform: capitalize !important;
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
	text-align: justify;
	text-justify: inter-word;
	color: ${colors.darkGreen};
	white-space: pre-wrap !important;
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

const InfoImage = styled.div`
	background-repeat: no-repeat;
	background-size: auto;
	background-position: center;
	background-image: url(${Info}) !important;
	@media ${smallScreen} {
		width: 10px;
		height: 30px;
		margin: 0 0 0 20px !important;
	}
	@media ${mediumScreen} {
		width: 11px;
		height: 33px;
		margin: 0 0 0 55px !important;
	}
	cursor: pointer;
`;

const InfoModal = () => {
	const { isLoaded, game } = GameContainer.useContainer();
	const [show, setShow] = useState(false);

	const handleOpen = () => {
		if (isLoaded) {
			setShow(true);
		}
	};
	const handleClose = () => {
		setShow(false);
	};

	return (
		<StyledModal
			trigger={<InfoImage onClick={handleOpen} />}
			open={show}
			onClose={handleClose}
		>
			<Modal.Content>
				<StyledCloseButton onClick={handleClose}>
					<BackgroundImage />
				</StyledCloseButton>
				<StyledHeader>{isLoaded ? game.title : ``}</StyledHeader>
				<StyledLabel>
					{isLoaded && game.terms_and_conditions !== ''
						? game.terms_and_conditions
						: `no terms & conditions to view`}
				</StyledLabel>
			</Modal.Content>
		</StyledModal>
	);
};

export default InfoModal;
