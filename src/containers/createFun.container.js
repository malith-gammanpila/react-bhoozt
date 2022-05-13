import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import messages from './messages.container';
import HomeContainer from './home.container';
import FriendsContainer from './friends.container';
import { setUserGames } from '../database/bhoozt_defaults.data';
import { CreateGame, ShareGame } from '../api/calls/createFun.api';

const useCreateFun = () => {
	const { notifyProgress, notifyError, notifySuccess } = messages();
	const { fetchUserData } = HomeContainer.useContainer();

	const [isBusy, setIsBusy] = useState(false);
	const [photoFile, setPhotoFile] = useState();
	const [photoUrl, setPhotoUrl] = useState();
	const [isGameCreated, setIsGameCreated] = useState(false);
	const [ids, setIds] = useState([]);
	const [checkAll, setCheckAll] = useState(false);
	const [newGame, setNewGame] = useState();
	const [isGameShared, setIsGameShared] = useState(false);
	const [successMsg, setSuccessMsg] = useState();
	const [completedCrop, setCompletedCrop] = useState(null);

	const handleSubmit = async (e) => {
		setIsGameCreated(false);
		setIsGameShared(false);
		e.preventDefault();

		if (
			!photoUrl ||
			photoUrl === null ||
			!photoFile ||
			photoFile === null
		) {
			notifyError('Please upload an image');
			return;
		}

		let data = photoFile;

		setIsBusy(true);
		notifyProgress('Please wait...');
		let [code, res] = await CreateGame(data, completedCrop);

		if (code >= 300) {
			setTimeout(() => {
				notifyError(res.message);
			}, 3000);
		} else if (code === 200) {
			notifySuccess(res.message);
			setNewGame(res.content.new_game);
			setIsGameCreated(true);
			if (res.content && res.content.games) {
				setUserGames(res.content.games);
				fetchUserData();
			}
		}
		setIsBusy(false);
	};

	const handleShareGame = async (e) => {
		e.preventDefault();
		setIsGameShared(false);
		if (!isGameCreated || !newGame || newGame === null) {
			notifyError('Please go back and create a game to share');
			return;
		} else if (ids.length <= 0) {
			notifyError('Select at least one friend to share your game');
			return;
		}

		let data = {
			user_ids: JSON.stringify(ids),
			game_id: newGame.id,
		};

		setIsBusy(true);
		notifyProgress('Please wait...');
		let [code, res] = await ShareGame(data);

		if (code >= 300) {
			setTimeout(() => {
				notifyError(res.message);
			}, 3000);
		} else if (code === 200) {
			notifySuccess('Game shared successfully');
		}
		setIsBusy(false);
		setIds([]);
		setIsGameShared(true);
		setSuccessMsg(res.message);
	};

	return {
		isBusy,
		setIsBusy,
		photoFile,
		setPhotoFile,
		photoUrl,
		setPhotoUrl,
		handleSubmit,
		isGameCreated,
		setIsGameCreated,
		ids,
		setIds,
		checkAll,
		setCheckAll,
		newGame,
		handleShareGame,
		isGameShared,
		setIsGameShared,
		successMsg,
		setSuccessMsg,
		completedCrop,
		setCompletedCrop,
	};
};

const CreateFunContainer = createContainer(useCreateFun);

export default CreateFunContainer;
