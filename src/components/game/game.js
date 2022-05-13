import React, { useState, useEffect, useRef } from 'react';
import { Loader, Dimmer, Button, Placeholder } from 'semantic-ui-react';
import { DragDropContainer, DropTarget } from '../../utils/react-drag-drop';
import { keyFrameGameBack } from '../funNearby/KeyFrames';
import { Dot } from 'pure-react-carousel';
import styled from 'styled-components';
import Reward from 'react-rewards';
import MetaTags from 'react-meta-tags';

// Containers
import HomeContainer from '../../containers/home.container';
import GameContainer from '../../containers/game.container';
import TutorialContainer from '../../containers/tutorial.container';
import NetworkContainer from '../../containers/network.container';
import AdvertisementContainer from '../../containers/advertisement.container';
import AnalyticContainer from '../../containers/analytic.container';
import RegisterContainer from '../../containers/register.container';

import useWindowDimensions from '../../hooks/windowDimention.hook';
import useRoute from '../../hooks/route.hook';
import { setUserDefault } from '../../database/bhoozt_defaults.data';

// Assets
import { CenteredContainer } from '../styles/styles';
import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import GameWinContent from './gameWinContent';
import WinSound from '../../assets/sounds/coin-drop.mp3';
import Logo from '../../assets/images/game-logo.png';
import Add from '../../assets/images/logo-button.png';
import PieceWinButton from '../../assets/images/piece-win-play.svg';
import KkAnimated from '../../assets/images/kk-bird-animated.gif';
import PushContainer from '../../containers/push.container';

const API_ENDPOINT_IMAGE = process.env.REACT_APP_API_ENDPOINT_IMAGE;

const StyledCenteredContainer = styled(CenteredContainer)`
	display: flex;
	@media ${smallScreen} {
		height: ${(props) =>
			props.height -
			350 +
			(props.isGameAdsAvailable === true ? 0 : 95)}px !important;
	}
	@media ${mediumScreen} {
		height: ${(props) =>
			props.height -
			395 +
			(props.isGameAdsAvailable === true ? 0 : 110)}px !important;
	}
`;

const GamePanel = styled.div`
	margin: 0 auto;
	display: flex;
	flex-wrap: wrap;
	@media ${smallScreen} {
		max-height: ${(props) => props.possiblePanelAreaSmall}px !important;
		height: ${(props) => props.actualPanelSizeSmall}px !important;
		width: ${(props) => props.actualPanelSizeSmall}px !important;
	}
	@media ${mediumScreen} {
		max-height: ${(props) => props.possiblePanelAreaMedium}px !important;
		height: ${(props) => props.actualPanelSizeMedium}px !important;
		width: ${(props) => props.actualPanelSizeMedium}px !important;
	}
`;

const GameCellBack = styled.div`
	@media ${smallScreen} {
		width: ${(props) => `${props.size ? props.size : 0}px`};
		height: ${(props) => `${props.size ? props.size : 0}px`};
		border: 0.1px solid white;
	}
	@media ${mediumScreen} {
		width: ${(props) => `${props.size ? props.size : 0}px`};
		height: ${(props) => `${props.size ? props.size : 0}px`};
		border: 0.1px solid white;
	}
	background-color: ${colors.lightGray};
	display: inline-block;
	// margin: 1px 1px 1px 1px;
`;

const GamePuzzelCell = styled.div`
	cursor: move !important;
	@media ${smallScreen} {
		width: ${(props) => `${props.size ? props.size : 0}px`};
		height: ${(props) => `${props.size ? props.size : 0}px`};
	}
	@media ${mediumScreen} {
		width: ${(props) => `${props.size ? props.size : 0}px`};
		height: ${(props) => `${props.size ? props.size : 0}px`};
	}
	margin: 0 !important;
	background-color: transparent;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	background-image: url(${(props) => props.image}) !important;
	cursor: ${(props) => (props.image !== '' ? 'pointer' : '')};
`;

const GameCell = styled.div`
	cursor: move !important;
	@media ${smallScreen} {
		height: ${(props) => (props.size <= 75 ? props.size : 75)}px;
		width: ${(props) => (props.size <= 75 ? props.size : 75)}px;
	}
	@media ${mediumScreen} {
		height: ${(props) => (props.size <= 75 ? props.size : 75)}px;
		width: ${(props) => (props.size <= 75 ? props.size : 75)}px;
	}
	margin-left: 5px;
	// margin-bottom: -10px;
	bottom: 0;
	left: 0;
	background-color: transparent;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	background-image: url(${(props) => props.image}) !important;
	cursor: ${(props) => (props.image !== '' ? 'pointer' : '')};
`;

const StyledRow = styled.div`
	overflow-x: hidden;
	overflow-y: hidden;
	@media ${smallScreen} {
		height: 80px;
	}
	@media ${mediumScreen} {
		height: 80px;
	}
	margin-bottom: 0px;
	display: flex;
	flex-direction: row;
	justify-content: start;
	align-items: center;
	margin-right: 15px;
	margin-left: 10px;
`;

const StyledImageButton = styled(Button)`
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: cover !important;
	background-image: url(${(props) => props.image}) !important;
	background-color: transparent !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	// TODO
	@media ${smallScreen} {
		width: 70px;
		height: 45px;
	}
	@media ${mediumScreen} {
		width: 155px;
		height: 100px;
	}
`;
const StyledAddBtnWrapper = styled.div`
	background-image: linear-gradient(
		-90deg,
		rgba(255, 255, 255, 1),
		rgba(255, 255, 255, 1),
		rgba(255, 255, 255, 1),
		rgba(255, 255, 255, 1),
		rgba(255, 255, 255, 0.75),
		rgba(255, 255, 255, 0.5),
		rgba(255, 255, 255, 0.25),
		rgba(255, 255, 255, 0)
	);
	@media ${smallScreen} {
		// width: 85px;
		height: 80px;
	}
	@media ${mediumScreen} {
		// width: 100px;
		height: 80px;
	}
	float: right;
	z-index: 500 !important;
	position: absolute !important;
	right: 0;
	margin-right: 15px !important;
	margin-left: auto !important;
`;

const AddButton = styled(StyledImageButton)`
	box-shadow: none !important;
	background-size: contain !important;
	margin-left: 25px !important;
	margin-right: 0 !important;
	cursor: pointer !important;
	border: none;
	@media ${smallScreen} {
		width: 60px;
		height: 80px;
		// margin-top: -65px;
	}
	@media ${mediumScreen} {
		width: 60px;
		height: 80px;
		// margin-top: -65px;
	}
	position: absolute;
	right: 20px;
	z-index: 999;
`;

const StyledWinButton = styled(StyledImageButton)`
	height: 70px !important;
	width: 70px !important;
	box-shadow: none !important;
	background-size: contain !important;
	filter: saturate(0) !important;
	padding: 30px 0px 0px 0px;
`;

const Heading = styled.p`
	margin: 10px auto 0 auto !important;
	min-height: 20px;
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

const StyledCenter6 = styled.div`
	background-color: transparent;
	margin-top: 40px;
	margin-left: -50px;
	width: 1px;
	height: 1px;
	border-radius: 50%;
	position: absolute;
	animation: ${keyFrameGameBack} 1s ease-in infinite;
	animation-delay: -1.5s;
	z-index: 998;
`;

const MainContainer = styled(CenteredContainer)`
	display: flex;
	flex-direction: row;
`;

const StyledColumn = styled.div`
	// border: 2px solid blue;
`;

const StyledImageColumn = styled(StyledColumn)`
	@media ${smallScreen} {
		height: 100%;
		width: 20%;
	}
	@media ${mediumScreen} {
		height: 100%;
		width: 15%;
	}
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: cover !important;
	background-image: url(${(props) => props.image}) !important;
`;

const StyledDragDropContainer = styled(DragDropContainer)`
	width: 80px;
	height: 80px;
`;

const Game = (props) => {
	const {
		setPath,
		user,
		setUser,
		setHeader,
		setInfoVisible,
		gameList,
		tempGameId,
		setTempGameId,
		handleGameClick,
		puzzleSize,
	} = HomeContainer.useContainer();
	const {
		alreadyWon,
		justWon,
		setJustWon,
		isBusy,
		isLoaded,
		gameId,
		setGameId,
		getGameDetails,
		game,
		playerGamePieces,
		correctPattern,
		updatePattern,
		pieceData,
		getNewPiecePrivate,
		isPieceVisible,
		setIsPieceVisible,
		winVisible,
		setWinVisible,
		isUpdating,
	} = GameContainer.useContainer();
	const { setIsPublic } = TutorialContainer.useContainer();
	const { height, width } = useWindowDimensions();
	const { handleRedirect } = useRoute();
	const { isOnline } = NetworkContainer.useContainer();
	const { gameAds } = AdvertisementContainer.useContainer();
	const { mpBackToBooztMe } = AnalyticContainer.useContainer();
	const {
		confirmationData,
		checkConfirmation,
	} = RegisterContainer.useContainer();
	const { setPushData } = PushContainer.useContainer();

	// state;
	const [cell, setCell] = useState([]);
	const [puzzel, setPuzzel] = useState([]);
	const [userPattern, setUserPattern] = useState([]);
	const [disabled, setDisabled] = useState(false);
	const [congratzMsg, setCongratzMsg] = useState('');
	const [grandPrizeCoins, setGrandPrizeCoins] = useState(0);
	const [flag, setFlag] = useState('');
	// const [dontPut, setDontPut] = useState(false);

	let pattern = [];

	// css calculations
	let possiblePanelSizeSmall = height - 340 - 20;
	let possiblePanelSizeMedium = height - 415;
	let possiblePanelAreaSmall = width - 50;
	let possiblePanelAreaMedium = 768 - 50;
	let actualPanelSizeSmall =
		possiblePanelSizeSmall >= possiblePanelAreaSmall
			? possiblePanelAreaSmall
			: possiblePanelSizeSmall;
	let actualPanelSizeMedium =
		possiblePanelSizeMedium >= possiblePanelAreaMedium
			? possiblePanelAreaMedium
			: possiblePanelSizeMedium;

	// DEBUG
	// console.log('___________________________________');
	// console.log('possiblePanelSizeMedium', possiblePanelSizeMedium);
	// console.log('possiblePanelAreaMedium', possiblePanelAreaMedium);
	// console.log('actualPanelSizeMedium', actualPanelSizeMedium);
	// console.log('___________________________________');
	// console.log('possiblePanelSizeSmall', possiblePanelSizeSmall);
	// console.log('possiblePanelAreaSmall', possiblePanelAreaSmall);
	// console.log('actualPanelSizeSmall', actualPanelSizeSmall);

	let size = game
		? width < 768
			? actualPanelSizeSmall / game.game_puzzle_size
			: // - game.game_puzzle_size
			  actualPanelSizeMedium / game.game_puzzle_size
		: // - game.game_puzzle_size
		  0;

	// reward ref and config
	let reward = useRef();
	const rewardConfig = {
		type: 'confetti',
		fakingRequest: false,
		angle: 90,
		decay: 0.91,
		spread: 100,
		startVelocity: 35,
		elementCount: 150,
		elementSize: 10,
		lifetime: 200,
		zIndex: 100,
		springAnimation: false,
	};

	/**
	 * Method to play game win sound
	 */
	const playGameWinSound = () => {
		if (
			game &&
			game.sounds &&
			game.sounds.game_win_sound &&
			game.sounds.game_win_sound !== null
		) {
			let path = `${API_ENDPOINT_IMAGE}${game.sounds.game_win_sound.url}`;
			let audio = new Audio(path);
			audio.load();
			audio.play();
			setTimeout(() => {
				audio.pause();
			}, 4000);
		}
	};

	/**
	 * Method to show reward animation
	 */
	useEffect(() => {
		if (justWon) {
			playGameWinSound();
			reward.rewardMe();
		}
	}, [justWon]);

	/*
	 * Method to set title
	 */
	useEffect(() => {
		setPath(props.location.pathname);
	}, [props.location.pathname]);

	/*
	 * Method to check whether redirected from /play
	 */
	useEffect(() => {
		if (!isOnline) {
			handleRedirect('/play');
		} else {
			if (tempGameId) {
				getGameDetails(tempGameId);
				setGameId(tempGameId);
				setTempGameId(null);
			} else if (gameId) {
				getGameDetails(gameId);
				// setGameId(null);
				setTempGameId(null);
			} else {
				handleRedirect('/play');
			}
		}
	}, []); // TODO

	/*
	 * Method to check win
	 */
	useEffect(() => {
		if (isLoaded) {
			if (alreadyWon) {
				setDisabled(true);
			} else {
				setDisabled(false);
			}
		}
	}, [isLoaded]);

	/*
	 * Method to initialize game
	 */
	useEffect(() => {
		if (isLoaded && game && playerGamePieces) {
			checkConfirmation().then(() => {
				setIsPublic(game.is_public);
				createPieces();
				createPuzzle(Math.pow(game.game_puzzle_size, 2));
			}); // + Check whether otp is confirmed to enable checkPattern
		}
	}, [isLoaded, game, playerGamePieces]);

	/**
	 * Method to reset game info bar on homeCarousel.js
	 */
	useEffect(() => {
		setInfoVisible(true);
	}, [gameId]);

	/**
	 * Method to refresh if new private piece
	 */
	useEffect(() => {
		if (gameId !== undefined) {
			if (isPieceVisible) {
				const cloneCell = [...cell];
				if (pieceData.game.issue_all === true) {
					pieceData.game.game_piece.forEach((p) => {
						cloneCell.push({
							piece_id: p.id,
							image: `${API_ENDPOINT_IMAGE}${p.image}`,
							dragStart: false,
						});
					});
				} else {
					cloneCell.push({
						piece_id: pieceData.game.game_piece.id,
						image: `${API_ENDPOINT_IMAGE}${pieceData.game.game_piece.image}`,
						dragStart: false,
					});
				}
				setCell(cloneCell);
			}
		}
	}, [isPieceVisible]);

	/**
	 * Method to show/hide win screen
	 */
	useEffect(() => {
		if (justWon) {
			setTimeout(() => {
				setWinVisible(true);
				setHeader('bhoozt');
			}, 5000);
		} else {
			setWinVisible(false);
		}
	}, [justWon]);

	const renderImagePlaceholders = (size) => {
		return (
			<Placeholder
				fluid={false}
				style={{
					height: size - 1,
					width: size - 1,
				}}
			>
				<Placeholder.Image />
			</Placeholder>
		);
	};

	/**
	 * Method to check if piece ids are equal
	 * @param {array} obj1 Long array
	 * @param {array} obj2 Short array
	 * @returns {boolean} true if equal
	 */
	const checkPieceId = (obj1, obj2) => {
		return obj1.piece_id === obj2.piece_id || obj1.id === obj2.piece_id;
	};

	/**
	 * @param {array} arr1
	 * @param {array} arr2
	 * @returns {array} Array of not played pieces
	 */
	const filterNotPlayed = (arr1, arr2) => {
		let notPlayedPieces = [];
		if (arr1 !== null && arr2 !== null) {
			arr1.forEach((obj1) => {
				let found = false;
				arr2.forEach((obj2) => {
					if (checkPieceId(obj1, obj2)) {
						found = true;
					}
				});
				if (!found) {
					notPlayedPieces.push(obj1);
				}
			});
		} else {
			notPlayedPieces = arr1;
		}
		return notPlayedPieces;
	};

	useEffect(() => {
		if (props.location.search !== '') {
			setPushData(getParamsFromUrl(props.location.search));
		}
	});

	const getParamsFromUrl = (url) => {
		url = decodeURI(url);
		if (typeof url === 'string') {
			let params = url.split('?');
			let eachParamsArr = params[1].split('&');
			let obj = {};
			if (eachParamsArr && eachParamsArr.length) {
				eachParamsArr.map((param) => {
					let keyValuePair = param.split('=');
					let key = keyValuePair[0];
					let value = keyValuePair[1];
					obj[key] = value;
				});
			}
			return obj;
		}
	};

	/**
	 * Method to create pieces array
	 */
	const createPieces = () => {
		let notPlayedPieces = filterNotPlayed(
			playerGamePieces,
			game.game_patterns.player_pattern
		);
		let tempCell = [];
		for (let index = 0; index < notPlayedPieces.length; index++) {
			tempCell.push({
				piece_id: notPlayedPieces[index].id,
				image: `${API_ENDPOINT_IMAGE}${notPlayedPieces[index].image}`,
				dragStart: false,
			});
		}
		setCell(tempCell);
	};

	/**
	 * @param {array} arr1
	 * @param {array} arr2
	 * @returns {array} Array of not played pieces
	 */
	const filterPlayed = (arr1, arr2) => {
		let playedPieces = [];
		if (arr1 !== null && arr2 !== null) {
			arr1.forEach((obj1) => {
				arr2.forEach((obj2) => {
					if (checkPieceId(obj1, obj2)) {
						playedPieces.push({ ...obj1, position: obj2.position });
					}
				});
			});
		}
		return playedPieces;
	};

	/**
	 * Method to create puzzle array
	 * @param {number} noCells number of cells
	 */
	const createPuzzle = (noCells) => {
		let playedPieces = filterPlayed(
			playerGamePieces,
			game.game_patterns.player_pattern
		);
		let tempPuzz = [];
		for (let index = 0; index < noCells; index++) {
			let pos = noCells - index;
			let playedPieceIndex = playedPieces.findIndex(
				(obj) => obj.position === pos
			);
			if (playedPieceIndex >= 0) {
				tempPuzz.push({
					piece_id: playedPieces[playedPieceIndex].id,
					position: pos,
					dragStart: false,
					image: `${API_ENDPOINT_IMAGE}${playedPieces[playedPieceIndex].image}`,
				});
			} else {
				tempPuzz.push({
					piece_id: -1 - index,
					position: pos,
					dragStart: false,
					image: '',
				});
			}
		}
		setPuzzel(tempPuzz);
	};

	const onDrop = (sourceData, destinationData) => {
		setFlag(sourceData); // TODO
		if (
			sourceData &&
			sourceData.piece_id &&
			sourceData.piece_id !== undefined &&
			destinationData &&
			destinationData.piece_id &&
			destinationData.piece_id !== undefined &&
			(confirmationData.is_otp_confirmed === true ||
				(user && user.user_role === 'anonymous') ||
				confirmationData.is_fresh_user)
		) {
			console.log('USER', user);
			if (sourceData.fromPuzzle && sourceData.image !== '') {
				const clonePuzzle = [...puzzel];

				if (clonePuzzle) {
					clonePuzzle[destinationData.index].piece_id =
						sourceData.piece_id;
					clonePuzzle[destinationData.index].image = sourceData.image;

					clonePuzzle[sourceData.index].piece_id =
						destinationData.piece_id;
					clonePuzzle[sourceData.index].image = destinationData.image;
					setPuzzel(clonePuzzle);
				}
			} else {
				if (destinationData.image === '') {
					const cloneCell = [...cell];
					cloneCell.splice(sourceData.index, 1);
					setCell(cloneCell);

					const clonePuzzle = [...puzzel];
					if (clonePuzzle) {
						clonePuzzle[destinationData.index].piece_id =
							sourceData.piece_id;
						clonePuzzle[destinationData.index].image =
							sourceData.image;
						setPuzzel(clonePuzzle);
					}
				}
			}
		}
		// TODO
		if (flag === '') {
			// console.log('updating patterns...'); // DEBUG
			setToUserPattern();
		}
		checkPattern();
	};

	/**
	 * Method to set users pattern
	 */
	const setToUserPattern = async () => {
		const tempArr = puzzel
			.map(({ dragStart, image, ...otherKeys }) => otherKeys)
			.reverse();
		pattern = tempArr;
		let res = await updatePattern(tempArr);
		// console.log('res', res); // DEBUG
		if (res !== null) {
			setCongratzMsg(res.status === 1 ? res.message : '');
			const cloneuser = { ...user };
			cloneuser.available_coins = res.content.player
				? res.content.player.player_total_coins
				: res.content.grand_prize.player_total_coins;
			setGrandPrizeCoins(
				res.content.grand_prize
					? res.content.grand_prize.prize_coins
					: 0
			);
			setUser(cloneuser);
			setUserDefault(cloneuser);
		}
		setUserPattern(tempArr);
	};

	/**
	 * Method to compare arrays
	 * @param	{array} arr1
	 * @param	{array} arr2
	 * @return	{boolean}	true if same, else false
	 * @note both arrays must be in accending position order
	 */
	const arraysMatch = (arr1, arr2) => {
		// Check if the arrays are mot null and are the same length
		if (arr1 === null || arr2 === null || arr1.length !== arr2.length)
			return false;

		// Check if all items exist and are in the same order
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i].piece_id !== arr2[i].piece_id) return false;
		}
		return true;
	};

	/**
	 * Method to compare the current puzzle pattern with correct pattern
	 * @return	{boolean}	true if won, else false
	 */
	const checkPattern = () => {
		if (arraysMatch(correctPattern, pattern)) {
			// reward.rewardMe();
			setDisabled(true);
			setJustWon(true);
		}
	};

	const handleRedirectBhooztMe = () => {
		handleRedirect('/play');

		//Mixpanel analytics
		if ((game, game.id, game.title)) {
			mpBackToBooztMe(game.id, game.title);
		}
	};

	return (
		<>
			<MetaTags>
				<meta
					name="description"
					content="Here is a bit of rewarding fun. Check this out, it's pretty crazy..."
				/>
			</MetaTags>
			{isLoaded ? (
				game.is_public ? (
					<StyledAddBtnWrapper>
						<StyledCenter6 />
						<AddButton
							as={Dot}
							slide={0}
							image={Logo}
							draggable={false}
							onClick={() => handleRedirectBhooztMe('/play')}
							disabled={isBusy}
						/>
					</StyledAddBtnWrapper>
				) : !isPieceVisible ? (
					winVisible ? (
						<AddButton
							as={Dot}
							slide={0}
							image={Logo}
							draggable={false}
							onClick={() =>
								gameList(user).then(() =>
									handleRedirect('/play')
								)
							}
							disabled={isBusy}
						/>
					) : (
						<StyledAddBtnWrapper>
							<AddButton
								as={Dot}
								slide={0}
								image={Add}
								draggable={false}
								onClick={() => getNewPiecePrivate()}
								disabled={isBusy}
							/>
						</StyledAddBtnWrapper>
					)
				) : null
			) : null}
			<StyledRow>
				{!isPieceVisible && !winVisible
					? isLoaded
						? cell.map((c, index) => (
								<DragDropContainer
									targetKey="foo"
									dragData={{
										index: index,
										piece_id: c.piece_id,
										fromPuzzle: false,
										image: c.image,
									}}
									onDrop={
										!disabled || !isUpdating
											? (e) =>
													onDrop(
														e.dragData,
														e.dropData
													)
											: null
									}
								>
									<GameCell
										// highlighted={c.dragStart}
										key={c.piece_id}
										draggable={!disabled}
										image={c.image}
										// size={35}
										size={size}
									/>
								</DragDropContainer>
						  ))
						: [...Array(puzzleSize)].map((item, index) =>
								renderImagePlaceholders(size)
						  )
					: null}
			</StyledRow>

			{!winVisible ? (
				<StyledCenteredContainer
					height={height}
					isGameAdsAvailable={gameAds.length > 0 ? true : false}
				>
					{isPieceVisible ? (
						<MainContainer>
							<StyledImageColumn image={KkAnimated} />
							<StyledColumn>
								<Heading>
									{pieceData.message
										? `Congratulations! You won ${
												pieceData.game.issue_all ===
												true
													? `all pieces`
													: `a piece`
										  } to ${game.title}`
										: null}
								</Heading>
								<SubHeading>
									{pieceData.message
										? pieceData.message.message
										: 'Try again..'}
								</SubHeading>
								<StyledWinButton
									onClick={() => setIsPieceVisible(false)}
									image={PieceWinButton}
								/>
							</StyledColumn>
							<StyledImageColumn />
						</MainContainer>
					) : (
						<Reward
							ref={(ref) => (reward = ref)}
							type={'confetti'}
							config={rewardConfig}
						>
							<GamePanel
								height={height}
								width={width}
								actualPanelSizeSmall={actualPanelSizeSmall}
								actualPanelSizeMedium={actualPanelSizeMedium}
								possiblePanelAreaSmall={possiblePanelAreaSmall}
								possiblePanelAreaMedium={
									possiblePanelAreaMedium
								}
							>
								{isLoaded
									? puzzel.map((item, index) => (
											<GameCellBack size={size}>
												<DragDropContainer
													targetKey="foo"
													dragData={{
														index: index,
														piece_id: item.piece_id,
														fromPuzzle: true,
														image: item.image,
													}}
													onDrop={
														!disabled || !isUpdating
															? (e) =>
																	onDrop(
																		e.dragData,
																		e.dropData
																	)
															: null
													}
													noDragging={
														disabled || !isOnline
													}
												>
													<DropTarget
														targetKey="foo"
														dropData={{
															index: index,
															piece_id:
																item.piece_id,
															image: item.image,
														}}
													>
														<GamePuzzelCell
															// disabled
															highlighted={
																item.dragStart
															}
															key={item.piece_id}
															draggable={
																!disabled
															}
															color={
																colors.lightGray
															}
															image={item.image}
															size={size}
															onContextMenu={(
																e
															) => {
																e.preventDefault();
															}}
														/>
													</DropTarget>
												</DragDropContainer>
											</GameCellBack>
									  ))
									: [...Array(puzzleSize)].map(
											(item, index) => (
												<GameCellBack size={size}>
													<DragDropContainer
														targetKey="foo"
														onDrop={
															!disabled ||
															!isUpdating
																? (e) =>
																		onDrop(
																			e.dragData,
																			e.dropData
																		)
																: null
														}
														noDragging={
															disabled ||
															!isOnline
														}
													>
														<DropTarget targetKey="foo">
															{renderImagePlaceholders(
																size - 1
															)}
														</DropTarget>
													</DragDropContainer>
												</GameCellBack>
											)
									  )}
							</GamePanel>
						</Reward>
					)}
				</StyledCenteredContainer>
			) : (
				<GameWinContent
					msg={congratzMsg}
					grandPrizeCoins={grandPrizeCoins}
				/>
			)}
		</>
	);
};

export default Game;
