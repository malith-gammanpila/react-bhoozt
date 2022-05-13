import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import {
	bhooztTickers,
	bhooztSettings,
	userDefaults,
	setUserDefault,
	userGames,
	coinValue,
	setUserGames,
} from '../database/bhoozt_defaults.data';
import { ProfileDetails } from '../api/calls/user.api';
import { PayPalPayment } from '../api/calls/paypal.api';
import useRoute from '../hooks/route.hook';
import messages from './messages.container';
import { AddPrivateGame, GameList } from '../api/calls/game.api';
import { GameClick } from '../api/calls/analytics.api';
import { MaxUsers, DistributeCoins } from '../api/calls/forward.api';
import NetworkContainer from './network.container';
import AnalyticContainer from './analytic.container';

const useHome = () => {
	const { handleRedirect, handleGoBack } = useRoute();
	const { notifySuccess, notifyError, notifyProgress } = messages();
	const { isOnline } = NetworkContainer.useContainer();
	const {
		setUserData,
		mpGameClick,
		mpUnlockGame,
		mpShareViaPayForward,
	} = AnalyticContainer.useContainer();

	const [header, setHeader] = useState('bhoozt');
	const [slide, setSlide] = useState(0);
	const [showGamePhase, setShowGamePhase] = useState(false);
	const [sidebarVisibility, setSidebarVisibility] = useState(false);
	const [tickers, setTickers] = useState();
	const [settings, setSettings] = useState({});
	const [user, setUser] = useState({});
	const [games, setGames] = useState([]);
	const [coinVal, setCoinVal] = useState(0);
	const [coins, setCoins] = useState(0);
	const [path, setPath] = useState('/');
	const [puzzleSize, setPuzzleSize] = useState(4);
	const [gameCode, setGameCode] = useState('');
	const [usedMethod, setUsedMethod] = useState();
	const [infoVisible, setInfoVisible] = useState(true);
	const [tempGameId, setTempGameId] = useState();
	const [gameIsPublic, setGameIsPublic] = useState(true);
	const [additionalBackVisible, setAdditionalBackVisible] = useState(false);

	const [maxUsers, setMaxUsers] = useState(-1);
	const [forwardCoins, setForwardCoins] = useState();

	// support value for modal close
	const [closeAllPopups, setCloseAllPopups] = useState(false);

	useEffect(() => {
		console.log(maxUsers, forwardCoins);
	}, [maxUsers, forwardCoins]);

	useEffect(() => {
		console.log('coins', coins);
	}, [coins]);

	useEffect(() => {
		if (user && user.id && path === '/play') {
			gameList(user).then(() => fetchGames());
		}
	}, [user, path]);

	useEffect(() => {
		if (user) {
			setUserData(user);
		}
	}, [user]);
	const handleSlide = (slider) => {
		setSlide(slider);
	};

	useEffect(() => {
		const coins = user ? user.available_coins : 0;
		if (path === '/play') {
			if (slide === 1) {
				setHeader('sponsors');
				setAdditionalBackVisible(true);
				coins !== undefined && setCoins(coins);
			} else if (slide === 2) {
				setHeader('coins');
				setAdditionalBackVisible(true);
				coins !== undefined && setCoins(coins);
			} else {
				setAdditionalBackVisible(false);
				setHeader('bhoozt');
				coins !== undefined && setCoins(coins);
			}
		} else if (path === '/game') {
			setHeader('game');
			setAdditionalBackVisible(false);
		} else if (path === '/redeem') {
			setHeader('redeem');
			setAdditionalBackVisible(false);
		} else if (path === '/forward') {
			setHeader('pay forward');
			setAdditionalBackVisible(false);
		} else if (path === '/paypal') {
			setHeader('PayPal');
			setAdditionalBackVisible(false);
		}
	}, [slide, path, user]);

	/*Load Tickers*/
	useEffect(() => {
		fetchTicker();
	}, [settings]);

	useEffect(() => {
		// console.log('Syncing with backend...');
		syncWithBackend();
	}, []);

	const syncWithBackend = () => {
		/*Load Bhoozt Settings*/
		fetchData();

		/*Bhoozt User*/
		fetchUser();

		/*Game List*/
		fetchGames();

		/*Coin Value*/
		getCoinValue();
	};

	// Update user data on sidebar open
	useEffect(() => {
		if (sidebarVisibility) {
			// fetch user data
			fetchUserData();
		}
	}, [sidebarVisibility]);

	const fetchUserData = async () => {
		const [code, res] = await ProfileDetails();
		if (code === 200) {
			fetchUser();
		}
	};

	const fetchTicker = async () => {
		setTickers(await bhooztTickers());
	};

	const fetchData = async () => {
		const response = await bhooztSettings();
		if (response !== undefined && response !== null) {
			setSettings(response);
		}
	};

	const fetchUser = async () => {
		const response = await userDefaults();
		if (response !== undefined && response !== null) {
			setUser(response);
			setCoins(response.available_coins);
		}
	};

	// Game List Screen
	const fetchGames = async () => {
		const response = await userGames();
		if (response !== undefined && response !== null) {
			setGames(response);
			// console.log('Game list updated');
		}
	};

	// Analytics Game Click
	const handleGameClick = async (gameId) => {
		if (isOnline) {
			gameList(user).then(() => {
				GameClick(gameId);

				// Mixpanel analytics
				let index = games.findIndex((g) => g.id === gameId);
				let game = games[index];
				if (
					game &&
					game.id &&
					game.title &&
					game.logo &&
					game.is_public &&
					game.game_owner &&
					game.game_owner.id &&
					game.game_owner.full_name
				) {
					mpGameClick(
						game.id,
						game.title,
						game.logo,
						game.is_public,
						game.game_owner.id,
						game.game_owner.full_name
					);
				}
			});
		} else {
			notifyError('Please check your internet connection');
		}
	};

	// Coin Screen
	const getCoinValue = async () => {
		const response = await coinValue();
		if (response !== undefined && response !== null) {
			setCoinVal(response);
		}
	};

	const handleFocus = (e) => {
		e.preventDefault();
		e.target.focus();
	};

	const handleChange = (e) => {
		e.preventDefault();
		setCoins(e.target.value);
	};

	// Reset coin input field
	const handleLater = () => {
		const coins = user ? user.available_coins : 0;
		setCoins(coins);
	};

	const handleRedeem = async () => {
		const [code, response] = await PayPalPayment(coins);
		notifyProgress('Processing...');
		if (code >= 300) {
			setTimeout(() => {
				notifyError(response.message);
			}, 3000);
		} else {
			if (response.status === 1) {
				handleRedirect('/play');
				notifySuccess(response.message);
				setCoins(response.content.user.available_coins);

				const cloneuser = { ...user };
				cloneuser.available_coins =
					response.content.user.available_coins;
				setUser(cloneuser);
				setUserDefault(cloneuser);
			}
		}
	};

	// Private Game Code
	const handleChangeGameCode = (e) => {
		e.preventDefault();
		setGameCode(e.target.value);
	};

	const handleGameCode = async (usedMethod) => {
		const [code, response] = await AddPrivateGame(gameCode, usedMethod);
		setUsedMethod('');
		if (code === 400) {
			if (response.message) {
				response.message ===
				'Sorry, please check your request parameters'
					? notifyError(
							'Sorry, code is invalid or expired. Please check'
					  )
					: notifyError(response.message || 'Something went wrong');
			}
			// Mixpanel analytics
			mpUnlockGame(null, null, 'Failure');
		} else if (code >= 300) {
			// Mixpanel analytics
			mpUnlockGame(null, null, 'Failure');

			return null;
		} else {
			if (response.status === 1) {
				// console.log('PVT Game Response', response); // DEBUG
				setPath(response.content.game.id);
				gameList(user).then(() => fetchGames());
				handleRedirect('/game');
				notifySuccess(
					`${response.message}: ${response.content.game.title}`
				);

				// Mixpanel analytics
				mpUnlockGame(
					response.content.game.id,
					response.content.game.title,
					'Success'
				);

				return response.content.game.id;
			}
		}
	};

	const handleGeoGameCode = async (c) => {
		const [code, response] = await AddPrivateGame(c, 'game_location');
		if (code === 400) {
			if (response.message) {
				response.message ===
				'Sorry, please check your request parameters'
					? notifyError(
							'Sorry, code is invalid or expired. Please check'
					  )
					: notifyError(response.message || 'Something went wrong');
			}
		} else if (code >= 300) {
			// notifyError('Something went wrong');
			return null;
		} else {
			if (response.status === 1) {
				setPath(response.content.game.id);
				console.log('ID:', response.content.game.id);
				gameList(user).then(() => fetchGames());
				notifySuccess(
					`${response.message}: ${response.content.game.title}`
				);
				return response.content.game.id;
			}
		}
	};

	const handleWithNewPiece = async (redirect) => {
		if (tempGameId) {
			GameClick(tempGameId); // perform to reorder games
			console.log('home.container.js 2');
		}
		gameList(user).then(() =>
			fetchGames().then(() => {
				if (redirect) {
					handleRedirect('/game');
				}
			})
		);
	};

	const gameList = async (user) => {
		const originalGames = [...games];
		const [code, response] = await GameList(user);
		if (code === 200) {
			if (response.status === 1) {
				response.content
					? await setUserGames(response.content.games)
					: await setUserGames(originalGames);
			}
		}
	};

	const checkMaxUsers = async (coins) => {
		setMaxUsers(-1);
		const [code, response] = await MaxUsers(coins);
		// notifyProgress('Processing...');
		if (code >= 300) {
			setTimeout(() => {
				notifyError(response.message);
			}, 3000);
		} else if (code === 200) {
			if (response.status === 1) {
				setMaxUsers(response.content.user_count);
				if (response.content.user_count <= 0) {
					notifyError(
						'Sorry, there are no eligible players found. Please try again later.'
					);

					// Mixpanel analytics
					if (user && user.available_coins && forwardCoins) {
						mpShareViaPayForward(
							user.available_coins,
							parseInt(forwardCoins),
							'No Users'
						);
					}
					setTimeout(() => {
						handleGoBack();
					}, 3000);
				}
			} else {
				console.log(response.message);
			}
		}
	};

	const changeMaxUsers = (e) => {
		e.preventDefault();
		setMaxUsers(e.target.value);
	};

	const changeForwardCoins = (e) => {
		e.preventDefault();
		setForwardCoins(e.target.value);
	};

	const sendCoins = async (p, c) => {
		const [code, response] = await DistributeCoins(c, p);
		if (code >= 300) {
			setTimeout(() => {
				notifyError(response.message);
			}, 3000);
		} else if (code === 200) {
			let user = await userDefaults();
			setUser(user);
			notifySuccess('Coins distributed successfully');

			// Mixpanel analytics
			if (user && user.available_coins && forwardCoins) {
				mpShareViaPayForward(
					user.available_coins,
					parseInt(forwardCoins),
					'Success'
				);
			}
			setTimeout(() => {
				handleRedirect('/play');
			}, 3000);
		}
	};

	return {
		header,
		slide,
		setSlide,
		showGamePhase,
		setShowGamePhase,
		sidebarVisibility,
		setSidebarVisibility,
		tickers,
		settings,
		user,
		setUser,
		games,
		setGames,
		coinVal,
		coins,
		handleSlide,
		handleChange,
		handleFocus,
		syncWithBackend,
		path,
		setPath,
		puzzleSize,
		setPuzzleSize,
		setHeader,
		handleRedeem,
		gameCode,
		setGameCode,
		handleGameCode,
		handleGeoGameCode,
		handleChangeGameCode,
		handleWithNewPiece,
		setCoins,
		handleGameClick,
		handleLater,
		infoVisible,
		setInfoVisible,
		gameList,
		fetchGames,
		fetchUser,
		checkMaxUsers,
		maxUsers,
		setMaxUsers,
		forwardCoins,
		setForwardCoins,
		changeMaxUsers,
		changeForwardCoins,
		sendCoins,
		tempGameId,
		setTempGameId,
		closeAllPopups,
		setCloseAllPopups,
		gameIsPublic,
		setGameIsPublic,
		fetchUserData,
		additionalBackVisible,
	};
};

let HomeContainer = createContainer(useHome);

export default HomeContainer;
