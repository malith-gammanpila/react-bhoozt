import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';

import { BhooztMe, PublicGame, PrivateGame } from '../database/tutorial.data';
import HomeContainer from './home.container';
import { setTutorials, tutotials } from '../database/bhoozt_defaults.data';

const useTutorial = () => {
	const { path } = HomeContainer.useContainer();
	const [index, setIndex] = useState(0);
	const [show, setShow] = useState(false);
	const [data, setData] = useState(BhooztMe);
	const [isPublic, setIsPublic] = useState();

	useEffect(() => {
		const tutorialScreens = tutotials();
		if (path === '/play') {
			tutorialScreens !== null &&
				tutorialScreens.map(
					(t) =>
						t === 'bhooztme' &&
						(setShow(true),
						setTimeout(() => {
							setTutorials(
								tutorialScreens.filter((t) => t !== 'bhooztme')
							);
						}, 3000))
				);
			setData(BhooztMe);
			setIndex(0);
		} else if (path === '/game') {
			if (isPublic) {
				tutorialScreens !== null &&
					tutorialScreens.map(
						(t) =>
							t === 'publicgame' &&
							(setShow(true),
							setTimeout(() => {
								setTutorials(
									tutorialScreens.filter(
										(t) => t !== 'publicgame'
									)
								);
							}, 3000))
					);
				setData(PublicGame);
				setIndex(0);
			} else {
				tutorialScreens !== null &&
					tutorialScreens.map(
						(t) =>
							t === 'privategame' &&
							(setShow(true),
							setTimeout(() => {
								setTutorials(
									tutorialScreens.filter(
										(t) => t !== 'privategame'
									)
								);
							}, 3000))
					);
				setData(PrivateGame);
				setIndex(0);
				setTutorials(
					tutorialScreens.filter((t) => t !== 'privategame')
				);
			}
		} else {
			setShow(false);
			setIndex(0);
		}
	}, [path, isPublic]);

	const handleClick = () => {
		const newIndex = index + 1;
		setIndex(newIndex);
	};

	const handleOpen = () => {
		setShow(true);
	};
	const handleClose = () => {
		setShow(false);
	};

	const skipAllTutorials = () => {
		setTutorials([]);
	};

	return {
		index,
		show,
		data,
		isPublic,
		setIsPublic,
		handleClick,
		handleOpen,
		handleClose,
		skipAllTutorials,
	};
};

const TutorialContainer = createContainer(useTutorial);

export default TutorialContainer;
