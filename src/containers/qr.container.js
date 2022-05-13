import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';

import messages from './messages.container';
import HomeContainer from './home.container';
import NetworkContainer from './network.container';
import useRoute from '../hooks/route.hook';
import GameContainer from './game.container';

const useQr = () => {
	const { notifyError, notifyForceDismiss } = messages();
	const {
		handleGameCode,
		gameCode,
		setGameCode,
		gameList,
		user,
		fetchGames,
		syncWithBackend,
		handleGameClick,
	} = HomeContainer.useContainer();
	const { handleRedirect } = useRoute();
	const { isOnline } = NetworkContainer.useContainer();

	const [isQrVisible, setIsQrVisible] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState();
	const [type, setType] = useState('');
	const [validated, setValidated] = useState(false);
	const [code, setCode] = useState();
	const [msg, setMsg] = useState();
	const [gameId, setGameId] = useState();

	useEffect(() => {
		validatePvtGameCode(result);
	}, [result]);

	const handleOpenQrModal = () => {
		// notifyForceDismiss();
		setIsQrVisible(true);
	};

	const handleCloseQrModal = () => {
		setIsQrVisible(false);
		resetContainer();
	};

	const validatePvtGameCode = (result) => {
		if (result !== null && result.substring(0, 10) === 'BHOOZT/PG/') {
			setType('PG');
			setValidated(true);

			let code = `${result.substring(10)}`;
			console.log(code);
			setCode(code);
			setGameCode(code);
			setMsg(`A private game code detected. ${code}`);
		}
	};

	useEffect(() => {
		if (gameCode !== '') {
			setTimeout(() => {
				handleAddPvtGame();
				handleCloseQrModal();
			}, 1000);
		}
	}, [gameCode]);

	const resetContainer = () => {
		setResult(null);
		setError();
		setType('');
		setValidated(false);
		setCode();
		setMsg();
		setGameId();
	};

	const handleAddPvtGame = () => {
		if (isOnline) {
			handleGameCode('game_code_qr').then((id) => {
				if (id) {
					handleRedirect('/play');
					handleGameClick(id);
					setGameId(id);
					gameList(user).then(() =>
						fetchGames().then(() =>
							setTimeout(() => {
								handleRedirect('/game');
								syncWithBackend();
							}, 1000)
						)
					);
				}
			});
		} else {
			notifyError('Please check your internet connection');
		}
	};

	return {
		isQrVisible,
		setIsQrVisible,
		handleOpenQrModal,
		handleCloseQrModal,
		result,
		setResult,
		error,
		setError,
		code,
		msg,
		gameId,
	};
};

const QrContainer = createContainer(useQr);

export default QrContainer;
