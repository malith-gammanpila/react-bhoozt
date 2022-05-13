import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import moment from 'moment';

import messages from './messages.container';
import HomeContainer from '../containers/home.container';
import {
	BhooztMe,
	BhooztMePrivate,
	GameDetails,
	UpdateGamePattern,
} from '../api/calls/game.api';
import { MasterData } from '../api/calls/masterdata.api';
import { GamePlayTime } from '../api/calls/analytics.api';
import NetworkContainer from './network.container';
import AdvertisementContainer from './advertisement.container';
import { userDefaults } from '../database/bhoozt_defaults.data';
import AnalyticContainer from './analytic.container';

const useGame = () => {
	const {
		path,
		setInfoVisible,
		user,
		setUser,
		gameIsPublic,
		setGameIsPublic,
	} = HomeContainer.useContainer();
	const {
		notifyError,
		notifyForceDismiss,
		notifyTryAgain,
		notifyGameWon,
	} = messages();
	const { isOnline } = NetworkContainer.useContainer();
	const { setGameAds } = AdvertisementContainer.useContainer();
	const {
		mpBhooztMeButtonTap,
		mpBhooztMePvtButtonTap,
	} = AnalyticContainer.useContainer();

	// BhooztMe state
	const [isPiece, setIsPiece] = useState(false);
	const [pieceData, setPieceData] = useState({});

	// Game state
	const [isPieceVisible, setIsPieceVisible] = useState(false);
	const [isBusy, setIsBusy] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isWon, setIsWon] = useState(false);
	const [gameId, setGameId] = useState(); // TODO
	const [game, setGame] = useState();
	const [playerGamePieces, setPlayerGamePieces] = useState();
	const [correctPattern, setCorrectPattern] = useState();
	const [playerPattern, setPlayerPattern] = useState();
	const [alreadyWon, setAlreadyWon] = useState(false);
	const [justWon, setJustWon] = useState(false);
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const [winVisible, setWinVisible] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [pieceCount, setPieceCount] = useState(0);

	/**
	 * Container function: Update user after load  ---> starts here
	 */
	useEffect(() => {
		if (!isBusy && isLoaded) {
			updateUser();
		}
	}, [isLoaded]);

	const updateUser = async () => {
		let newUser = await userDefaults();
		if (newUser) {
			setUser(newUser);
		} else {
			setUser(user);
		}
	};
	//---------------------------------------> ends here

	/**
	 * Container function: Show/Hide Game Info Bar
	 */
	useEffect(() => {
		if (isPieceVisible) {
			setInfoVisible(false); // game info on homeCarousel.js
		} else {
			setInfoVisible(true);
		}
	}, [isPieceVisible]);

	/**
	 * Container function: Show "You already won the game" message
	 */
	useEffect(() => {
		if (isLoaded && alreadyWon) {
			notifyGameWon('You already won the game');
		}
	}, [alreadyWon, isLoaded]);

	/**
	 * Container function: Control win screen in game.js
	 */
	useEffect(() => {
		if (justWon) {
			setTimeout(() => {
				setJustWon(false);
			}, 1000);
		}
	}, [justWon]);

	/**
	 * Container function: getNewPiece
	 * try to fetch puzzle pieces from the Bhoozt backend
	 */
	const getNewPiece = async () => {
		if (isOnline) {
			setIsBusy(true);
			let [status, pieceStatus, data] = await BhooztMe();

			if (status >= 300) {
				// notifyError('Something went wrong');
			} else {
				setPieceData(data);
				MasterData();
				pieceStatus === 1 ? setIsPiece(true) : setIsPiece(false);
				pieceStatus === 1
					? mpBhooztMeButtonTap('Success')
					: mpBhooztMeButtonTap('Try Again');
			}
			setIsBusy(false);
		} else {
			notifyError('Please check your internet connection');
		}
	};

	/**
	 * Container function: getNewPiecePrivate
	 * try to fetch private puzzle pieces from the Bhoozt backend
	 */
	const getNewPiecePrivate = async () => {
		if (isOnline) {
			if (game.pieces_info.total_game_piece_count - pieceCount > 0) {
				setIsBusy(true);
				let [status, pieceStatus, data] = await BhooztMePrivate(gameId);

				if (status >= 300) {
					// Mixpanel analytics
					if (game && game.id && game.title) {
						mpBhooztMePvtButtonTap(game.id, game.title, 'Failure');
					}
				} else {
					setPieceData(data);

					if (pieceStatus === 1) {
						setPieceCount(
							data.game.pieces_info.player_game_piece_count
						);
						setIsPiece(true);
						MasterData();
						setIsPieceVisible(true);

						// Mixpanel analytics
						if (game && game.id && game.title) {
							mpBhooztMePvtButtonTap(
								game.id,
								game.title,
								'Success'
							);
						}
					} else {
						setIsPiece(false);
						notifyTryAgain('Try again.');
						setTimeout(() => {
							notifyForceDismiss();
						}, 2000);

						// Mixpanel analytics
						if (game && game.id && game.title) {
							mpBhooztMePvtButtonTap(
								game.id,
								game.title,
								'Try Again'
							);
						}
					}
				}
			} else {
				notifyTryAgain(
					'Hey, you’ve got all the pieces. You just need to put them together.'
				);
				setTimeout(() => {
					notifyForceDismiss();
				}, 3000);
			}
			setIsBusy(false);
		} else {
			notifyError('Please check your internet connection');
		}
	};

	/**
	 * Container function:
	 * clear piece data in the container state
	 */
	const clearPieceData = () => {
		setPieceData({});
		setIsPiece(false);
	};

	/**
	 * Container function:
	 * clear game data in the container state
	 */
	const clearGameData = () => {
		setGame({});
	};

	/**
	 * Method to call GameDetails API and store data
	 * @param	{id} game id
	 */
	const getGameDetails = async (id) => {
		setAlreadyWon(false); // Clear "already won" msg
		setIsLoaded(false);
		setPlayerGamePieces([]);
		clearGameData();
		setGameAds([]);
		let [status, data] = await GameDetails(id);

		if (status >= 300) {
			// notifyError('Something went wrong');
		} else {
			setGame(data.content.game);
			setGameIsPublic(data.content.game.is_public);
			setGameAds(data.content.game_ads ? data.content.game_ads : []);
			setPlayerGamePieces(
				data.content.player_game_pieces
					? data.content.player_game_pieces
					: []
			);
			setPieceCount(
				data.content.game.pieces_info.player_game_piece_count
			);
			setCorrectPattern(data.content.game.game_patterns.correct_pattern);
			setPlayerPattern(data.content.game.game_patterns.player_pattern);
			if (data.content.game.game_patterns) {
				setAlreadyWon(
					checkPattern(
						data.content.game.game_patterns.correct_pattern,
						data.content.game.game_patterns.player_pattern
					)
				);
			}
			setTimeout(() => {
				setIsLoaded(true);
				data = undefined;
			}, 3000);
		}
	};

	/**
	 * Method to compare pattern arrays
	 * @param	{array} arr1
	 * @param	{array} arr2
	 * @return	{boolean}	true if same, else false
	 * @note both arrays must be in accending position order
	 */
	const checkPattern = (arr1, arr2) => {
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
	 * Method to call UpdateGamePattern API
	 * @param	{id} game id
	 */
	const updatePattern = async (pattern) => {
		if (isOnline) {
			setIsUpdating(true);
			let newPattern = [];
			let uniquePattern = [];
			for (let index = 0; index < pattern.length; index++) {
				if (pattern[index].piece_id >= 0) {
					newPattern.push(pattern[index]);
				}
			}

			uniquePattern = newPattern.filter(
				((set) => (o) => !set.has(o.piece_id) && set.add(o.piece_id))(
					new Set()
				)
			);

			let stringPattern = JSON.stringify(uniquePattern);
			let [status, data] = await UpdateGamePattern(gameId, stringPattern);
			setIsUpdating(false);

			if (status >= 300) {
				// notifyError('Something went wrong when saving');
				return null;
			} else {
				if (data && data.status) {
					if (data.status === 0) {
						// notifyError(data.message);
					}
				}
				return data;
			}
		} else {
			notifyError('Please check your internet connection');
		}
	};

	/**
	 * Get Game Start Time and Stop Time
	 */
	useEffect(() => {
		path === '/game' ? onGameStart() : onGameStop();
	}, [path]);

	/**
	 * Game Start Time
	 */
	const onGameStart = () => {
		const StartTime = new Date();
		var gameStart = moment(StartTime).format();
		setStartTime(gameStart);
	};

	/**
	 * Game Stop Time
	 */
	const onGameStop = () => {
		const EndTime = new Date();
		var gameEnd = moment(EndTime).format();
		if (startTime) {
			setEndTime(gameEnd);
			game !== undefined && gamePlayTime(game.id, startTime, gameEnd);
		}
	};

	/**
	 * Method to call Analytics - Game Play Time API
	 * @param {*} gameId
	 * @param {*} startTime
	 * @param {*} endTime
	 */
	const gamePlayTime = async (gameId, startTime, endTime) => {
		await GamePlayTime(gameId, startTime, endTime);
		setStartTime('');
	};

	return {
		alreadyWon,
		setAlreadyWon,
		justWon,
		setJustWon,
		isBusy,
		isLoaded,
		isPiece,
		pieceData,
		getNewPiece,
		getNewPiecePrivate,
		clearPieceData,
		getGameDetails,
		gameId,
		setGameId,
		game,
		playerGamePieces,
		correctPattern,
		playerPattern,
		updatePattern,
		clearGameData,
		isWon,
		setIsWon,
		isPieceVisible,
		setIsPieceVisible,
		winVisible,
		setWinVisible,
		isUpdating,
	};
};

const GameContainer = createContainer(useGame);

export default GameContainer;
