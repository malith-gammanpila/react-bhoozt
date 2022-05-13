import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Header, Modal } from 'semantic-ui-react';

import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import TutorialContainer from '../../containers/tutorial.container';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import BhooztLogo from '../../assets/images/bhoozt_loading.png';
import close from '../../assets/images/close.svg';
import { Column, Row } from '../styles/styles';

const StyledModal = styled(Modal)`
	border-radius: 20px !important;
	@media ${smallScreen} {
		max-width: 300px !important;
	}
	@media ${mediumScreen} {
		max-width: 400px !important;
	}
`;

const TutorialImage = styled.div`
	background-position: center;
	background-repeat: no-repeat;
	background-size: contain;
	background-image: url(${(props) => props.image}) !important;
	margin: 0 auto 0 auto !important;
	@media ${smallScreen} {
		width: 100%;
		height: 100%;
	}
	@media ${mediumScreen} {
		width: 100%;
		height: 100%;
	}
`;

const ModalContent = styled.div`
	display: flex;
	flex-direction: column;
	padding: 30px 40px !important;
	@media ${smallScreen} {
		max-height: 600px !important;
	}
	@media ${mediumScreen} {
		max-height: 700px !important;
	}
	height: ${(props) => props.height - 45}px;
`;

const Description = styled.p`
	font-size: 14px;
	text-align: center;
	color: ${colors.darkGray};
	padding: 25px 0;
	margin-bottom: 0;
`;

const Title = styled(Description)`
	font-size: 18px;
`;
const StyledButton = styled(Button)`
	color: ${colors.white} !important;
	background-color: ${colors.green} !important;
	margin: 0 auto !important;
	border: 0px solid ${colors.green} !important;
	@media ${smallScreen} {
		width: 220px;
		height: 40px;
	}
	@media ${mediumScreen} {
		width: 320px;
		height: 45px;
	}
`;

const StyledPromptButton = styled(StyledButton)`
	margin: 5px !important;
	@media ${smallScreen} {
		width: 95px;
		height: 40px;
	}
	@media ${mediumScreen} {
		width: 140px;
		height: 45px;
	}
`;

const StyledPromptButtonRed = styled(StyledPromptButton)`
	background-color: ${colors.red} !important;
`;

const BhooztImage = styled.div`
	// position: absolute;
	// display: flex;
	align-items: center;
	justify-content: center;
	// height: ${(props) => `${props.height}px`}
	// width: 100vw;
	// background-color: white;
	// top: 0;
	// bottom: 0;
	// left: 0;
	// right: 0;
`;

const Link = styled.a`
	display: flex;
	justify-content: center;
	text-decoration: underline;
	text-transform: capitalize;
	color: ${colors.green} !important;
	padding: 25px 10px 0px 10px;
	:hover {
		text-decoration: underline;
	}
	cursor: pointer;
	@media ${smallScreen} {
		font-size: 14px !important;
	}
	@media ${mediumScreen} {
		font-size: 16px !important;
	}
`;

const PromptWrapper = styled.div`
	margin: auto;
	align-items: center;
	justify-content: center;
	display: flex;
	flex-direction: column;
`;

const StyledPromptBtnWrapper = styled.div`
	margin: auto;
	align-items: center;
	justify-content: center;
	display: flex;
	flex-direction: row;
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

const StyledHeader = styled(Header)`
	text-align: center;
	margin: 0 !important;
	margin-bottom: 15px !important;
	text-transform: uppercase !important;
	color: ${colors.darkGreen} !important;
	@media ${smallScreen} {
		font-size: 12px !important;
	}
	@media ${mediumScreen} {
		font-size: 16px !important;
	}
`;

const Tutorial = () => {
	const { height } = useWindowDimensions();

	const {
		index,
		show,
		data,
		handleClick,
		handleClose,
		skipAllTutorials,
	} = TutorialContainer.useContainer();

	const [showPrompt, setShowPrompt] = useState(true);

	const handleSkipAll = () => {
		handleClose();
		skipAllTutorials();
	};

	const renderTutorialContent = () => {
		return (
			<>
				<Row>
					<Column>
						<StyledCloseButton onClick={handleSkipAll}>
							<BackgroundImage />
						</StyledCloseButton>
					</Column>
				</Row>
				<Row>
					<Column>
						<StyledHeader>Tutorial</StyledHeader>
					</Column>
				</Row>
				<TutorialImage
					image={data ? data[index].image : null}
					height={height}
				/>
				<Description>{data ? data[index].title : ''}</Description>
				<StyledButton
					onClick={
						data[index].link ? () => handleClick() : handleClose
					}
				>
					{data[index].link ? 'Next' : 'Close Tutorial'}
				</StyledButton>
				{/* {data[index].link ? (
					<Link onClick={handleClose}>Close Tutorial</Link>
				) : (
					''
				)} */}
			</>
		);
	};

	const renderUserPrompt = () => {
		return (
			<PromptWrapper>
				<img
					src={BhooztLogo}
					alt="Bhoozt"
					style={{
						height: 'unset',
						width: '50%',
						marginBottom: '50',
					}}
				/>
				<Title>Want a quick tutorial?</Title>
				<StyledPromptBtnWrapper>
					<StyledPromptButtonRed
						onClick={() => {
							handleSkipAll();
						}}
					>
						No
					</StyledPromptButtonRed>
					<StyledPromptButton
						onClick={() => {
							setShowPrompt(false);
						}}
					>
						Yes
					</StyledPromptButton>
				</StyledPromptBtnWrapper>
			</PromptWrapper>
		);
	};

	return (
		<StyledModal
			open={show}
			onClose={handleClose}
			closeOnDimmerClick={false}
		>
			<ModalContent height={height}>
				{showPrompt ? renderUserPrompt() : renderTutorialContent()}
			</ModalContent>
		</StyledModal>
	);
};

export default Tutorial;
