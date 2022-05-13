import React from 'react';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';

import { CenteredContainer } from '../styles/styles';
import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import LogoButton from '../../assets/images/forward_btn.svg';
import PieceWinButton from '../../assets/images/piece-win-play.svg';
import KkAnimated from '../../assets/images/kk-bird-animated.gif';
import HomeContainer from '../../containers/home.container';
import GameContainer from '../../containers/game.container';
import TutorialContainer from '../../containers/tutorial.container';
import useWindowDimensions from '../../hooks/windowDimention.hook';

const Heading = styled.p`
	margin: 10px auto 0 auto !important;
	min-height: 50px;
	width: 200px;
	color: ${colors.darkGreen};
	@media ${smallScreen} {
		font-size: 14px;
	}
	@media ${mediumScreen} {
		font-size: 18px;
	}
`;

const SubHeading = styled(Heading)`
	margin: 0 auto 10px auto !important;
`;

const StyledImageButton = styled(Button)`
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	background-image: url(${(props) => props.image}) !important;
	background-color: transparent !important;
	// box-shadow: 1px 3px 10px ${colors.gray} !important;
	box-shadow: none !important;
	border-radius: 0px !important;
	@media ${smallScreen} {
		width: 70px;
		height: 70px;
		// border-radius: 5px !important;
	}
	@media ${mediumScreen} {
		// border-radius: 15px !important;
		width: 75px;
		height: 75px;
	}
`;

const StyledWinButton = styled(StyledImageButton)`
	height: 100px !important;
	width: 100px !important;
	box-shadow: none !important;
	background-size: contain !important;
	filter: saturate(0) !important;
`;

const MainContainer = styled(CenteredContainer)`
	display: flex;
	flex-direction: row;
`;

const StyledColumn = styled.div`
	@media ${smallScreen} {
		// height: 60%;
	}
	@media ${mediumScreen} {
		// height: 90%;
	}
`;

const StyledImageColumn = styled(StyledColumn)`
	@media ${smallScreen} {
		height: 25%;
		width: 20%;
	}
	@media ${mediumScreen} {
		height: 40%;
		width: 15%;
	}
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: cover !important;
	background-image: url(${(props) => props.image}) !important;
`;

const GamePhaseContent = () => {
	const {
		setShowGamePhase,
		// syncWithBackend,
		handleWithNewPiece,
		setTempGameId,
	} = HomeContainer.useContainer();
	const {
		isPiece,
		pieceData,
		clearPieceData,
		setGameId,
	} = GameContainer.useContainer();
	const { setIsPublic } = TutorialContainer.useContainer();
	const { height } = useWindowDimensions();

	// useEffect(() => {
	// 	console.log('ISPIECE:', isPiece); // DEBUG
	// 	console.log('PIECEDATA:', pieceData); // DEBUG
	// }, [pieceData]);

	// retry
	const hadnleOnRetry = () => {
		clearPieceData();
		setShowGamePhase(false);
	};

	// go into the game with new piece
	const hadnleOnPlay = async (redirect) => {
		setGameId(pieceData.content.game.id);
		setTempGameId(pieceData.content.game.id); // to perform a game click
		handleWithNewPiece(redirect).then(() => setShowGamePhase(false));
		setIsPublic(pieceData.content.game.is_public);
	};

	return (
		<MainContainer height={height}>
			<StyledImageColumn image={KkAnimated} />
			<StyledColumn>
				<Heading>
					{isPiece && pieceData.content.game.title
						? `Congratulations! You won ${
								pieceData.content.game.issue_all === true
									? `all pieces`
									: `a piece`
						  } to ${pieceData.content.game.title}`
						: ''}
				</Heading>
				<SubHeading>
					{pieceData.message ? pieceData.message : 'Try again..'}
				</SubHeading>
				{isPiece ? (
					<StyledWinButton
						onClick={() => hadnleOnPlay(true)}
						image={PieceWinButton}
					/>
				) : (
					<StyledImageButton
						onClick={() => hadnleOnRetry()}
						image={LogoButton}
					/>
				)}
			</StyledColumn>
			<StyledImageColumn />
		</MainContainer>
	);
};

export default GamePhaseContent;
